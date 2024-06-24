import { defineEventHandler, readBody } from "h3";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default defineEventHandler(async (event) => {
  const { audioUrl } = await readBody(event);

  try {
    const transcript = await client.intelligence.v2.transcripts.create({
      mediaUrl: audioUrl,
      channel: {},
      serviceSid: "GA164674f4f7e47a5c734f519381870d6d"
    });

    console.log({ transcript });

    // const summary = await summarizeText(transcription.transcriptionText)

    // return { summary }
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return { error: "Failed to transcribe audio" };
  }
});

async function summarizeText(text: string): Promise<string> {
  // Implement text summarization logic here
  return text.substring(0, 200) + "..."; // Placeholder for actual summarization
}
