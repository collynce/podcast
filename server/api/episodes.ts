import { defineEventHandler, getQuery } from "h3";
import axios from "axios";

export default defineEventHandler(async (event) => {
  const { id, offset = 0, limit = 20 } = await readBody(event);
  const accessToken = getCookie(event, "access_token");

  const response = await axios.get(
    `https://api.spotify.com/v1/shows/${id}/episodes`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      params: {
        offset,
        limit,
      },
    }
  );

  return response.data;
});