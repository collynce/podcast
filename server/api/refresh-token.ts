import { defineEventHandler, getQuery, setCookie } from "h3";
import axios from "axios";
import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const refresh_token = query.refresh_token as string;

  if (!refresh_token) {
    return { error: "No refresh token provided" };
  }

  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
  };

  try {
    const response = await axios(authOptions);
    const { access_token, refresh_token: new_refresh_token, expires_in } = response.data;

    // Set new access token cookie
    setCookie(event, "access_token", access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
      sameSite: "lax",
    });

    // If a new refresh token is provided, update it
    if (new_refresh_token) {
      setCookie(event, "refresh_token", new_refresh_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    // Return only necessary information
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);

    // Clear cookies on error
    setCookie(event, "access_token", "", { maxAge: 0, path: "/" });
    setCookie(event, "refresh_token", "", { maxAge: 0, path: "/" });

    return { error: "Failed to refresh token" };
  }
});