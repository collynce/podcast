export const useAuth = () => {
  const store = useAuthStore();
  const accessToken = ref(useCookie("access_token"));
  const refreshToken = ref(useCookie("refresh_token"));
  const user = computed((): SpotifyUser | null => store.getUser);

  const setUser = async () => {
    try {
      const data = await $fetch<SpotifyUser>("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });
      store.setUser(data);
      return data;
    } catch (err) {
      return handleApiError(err, async () => setUser);
    }
  };

  const refreshTokenRequest = async () => {
    if (!refreshToken.value) return false;

    try {
      const { data } = await useFetch(
        `/api/refresh-token?refresh_token=${refreshToken.value}`
      );
      if (data.value && data.value) {
        return true;
      }
      throw new Error("Failed to refresh token");
    } catch (err) {
      console.error("Error refreshing token:", err);
      accessToken.value = null;
      refreshToken.value = null;
      store.setUser(null);
      return false;
    }
  };

  const handleApiError = async (
    err: any,
    retryFunction: () => Promise<any>
  ) => {
    if (err.response?.status === 401) {
      const refreshed = await refreshTokenRequest();
      if (refreshed) {
        return await retryFunction();
      }
    } else {
      console.error("API Error:", err);
    }
  };

  return {
    refreshTokenRequest,
    handleApiError,
    setUser,
    accessToken,
    refreshToken,
    user,
  };
};
