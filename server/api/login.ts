import { defineEventHandler } from "h3";
import crypto from "crypto";
import querystring from "querystring";

const generateRandomString = (length: number) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const stateKey = "spotify_auth_state";

export default defineEventHandler((event) => {
  const state = generateRandomString(16);
  setCookie(event, stateKey, state, { httpOnly: true });

  const scope =
    "user-read-private user-read-email user-library-read ugc-image-upload playlist-read-private user-read-playback-position";
  const queryParams = querystring.stringify({
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
    state,
  });

  return sendRedirect(
    event,
    `https://accounts.spotify.com/authorize?${queryParams}`
  );
});
