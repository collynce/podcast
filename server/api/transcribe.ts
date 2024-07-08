import { defineEventHandler, readBody } from "h3";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default defineEventHandler(async (event) => {
  const { audioUrl } = await readBody(event);

  try {
    const transcript = await client.intelligence.v2.transcripts
      .create({
        channel: {
          media_properties: {
            source_sid: null,
            media_url: audioUrl,
          },
          participants: [],
        },
        serviceSid: `${process.env.TWILIO_SERVICE_SID}`,
      })
      .catch((err) => {
        console.error({ err });
      });

    return transcript;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return { error: "Failed to transcribe audio" };
  }
});
