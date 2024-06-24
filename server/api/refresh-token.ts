import { defineEventHandler, getQuery } from "h3";
import axios from "axios";
import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const refresh_token = query.refresh_token as string;

  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
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
    return response.data;
  } catch (error) {
    return { error: "invalid_refresh_token" };
  }
});
