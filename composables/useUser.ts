export const useUser = () => {
    const store = useAuthStore();

    const user = computed((): SpotifyUser | null => store.getUser);
    const accessToken = ref(useCookie("access_token"));
    const refreshToken = ref(useCookie("refresh_token"));

    const setUser = async () => {
        const data = await $fetch<SpotifyUser>("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken.value}`,
            },
        });

        store.setUser(data);
    };

    return {
        setUser,
        user,
        accessToken,
        refreshToken,
    };
};