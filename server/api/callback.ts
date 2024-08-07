import {
  defineEventHandler,
  getQuery,
  getCookie,
  setCookie,
  sendRedirect,
} from "h3";
import axios from "axios";
import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const stateKey = "spotify_auth_state";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = (query.code as string) || null;
  const state = (query.state as string) || null;
  const storedState = getCookie(event, stateKey);

  if (state === null || state !== storedState) {
    return sendRedirect(event, "/?error=state_mismatch");
  }

  setCookie(event, stateKey, "", { maxAge: -1 });

  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      code,
      redirect_uri,
      grant_type: "authorization_code",
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
  };

  try {
    const response = await axios(authOptions);
    const { access_token, refresh_token, expires_in } = response.data;

    // Set cookie for access token with expiration
    setCookie(event, "access_token", access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
    });

    // Set cookie for refresh token with a longer expiration (e.g., 30 days)
    setCookie(event, "refresh_token", refresh_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Redirect to the Nuxt frontend
    return sendRedirect(event, "/");
  } catch (error) {
    console.error("Error in token exchange:", error);
    return sendRedirect(event, "/?error=invalid_token");
  }
});