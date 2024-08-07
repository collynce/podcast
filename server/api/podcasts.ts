import { defineEventHandler, getQuery, createError } from "h3";
import axios from "axios";

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, "access_token");

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/shows", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Use createError to properly set the status code
      throw createError({
        statusCode: error.response.status,
        statusMessage: error.response.statusText,
        data: error.response.data,
      });
    }
    // For non-Axios errors or Axios errors without a response
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: { message: "An unexpected error occurred" },
    });
  }
});