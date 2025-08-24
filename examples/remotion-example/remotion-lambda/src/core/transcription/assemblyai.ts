import { AssemblyAI } from "assemblyai";
import { z } from "zod";
import { AssemblyAIUtterance, AssemblyAIWord, Caption, CaptionSchema, Word } from "../schemas";


/**
 * Transcribes an audio file using AssemblyAI.
 *
 * @param audioUrl The public URL of the audio file to be transcribed.
 * @param apiKey Your AssemblyAI API key.
 * @param language Optional BCP-47 language code to improve accuracy.
 * @returns A promise that resolves to an array of Caption objects.
 */
export async function transcribeAudio(
  audioUrl: string,
  apiKey: string,
  language?: string
): Promise<Caption[]> {
  const assemblyAIKey = apiKey || process.env.ASSEMBLYAI_API_KEY;

  if (!assemblyAIKey) {
    throw new Error("AssemblyAI API key is required.");
  }

  const client = new AssemblyAI({ apiKey: assemblyAIKey });

  try {
    console.log(`Starting AssemblyAI transcription for: ${audioUrl}`);

    const params: any = {
      audio: audioUrl,
      speech_model: "universal",
      speaker_labels: true,
    };

    if (language) {
      params.language_code = language;
      console.log(`Using language hint: ${language}`);
    }

    const transcript = await client.transcripts.transcribe(params);

    if (transcript.status === "error") {
      throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
    }

    if (!transcript.utterances) {
      throw new Error("Utterance data is missing from the AssemblyAI response.");
    }

    console.log("Successfully received transcription from AssemblyAI: ", JSON.stringify(transcript, null, 2));

    const captions: Caption[] = transcript.utterances.map(
      (utterance: AssemblyAIUtterance, index: number): Caption => {
        const words: Word[] = utterance.words.map((word: AssemblyAIWord) => ({
          word: word.text,
          startTime: word.start / 1000,
          endTime: word.end / 1000,
        }));

        return {
          id: `caption-${index}`,
          text: utterance.text,
          startTime: utterance.start / 1000,
          endTime: utterance.end / 1000,
          words: words,
        };
      }
    );

    // Validate the output with Zod before returning
    return z.array(CaptionSchema).parse(captions);

  } catch (error) {
    console.error("An error occurred during AssemblyAI transcription:", error);
    throw new Error("Failed to transcribe audio with AssemblyAI.");
  }
} 