import { describe, test, expect, beforeAll } from 'vitest';
import { createClient, postApiGenerate, getApiGet, postApiCustomGenerate, postV1ChatCompletions, getApiGetLimit, postApiGenerateLyrics, postApiExtendAudio, postApiGenerateStems, getApiGetAlignedLyrics, getApiClip, postApiConcat, getApiPersona } from '../index';
import * as dotenv from 'dotenv';
import { randomBytes } from 'crypto';

dotenv.config();

const sunoApiKey = process.env.SUNO_API_KEY;
const baseUrl = process.env.SUNO_API_BASE_URL;

const envsAreSet = sunoApiKey && baseUrl;

if (!envsAreSet) {
  console.log(
    'SUNO_API_KEY and/or SUNO_API_BASE_URL not set in .env. Skipping tests.'
  );
}

describe.skipIf(!envsAreSet)('Suno API SDK', () => {
  let client: ReturnType<typeof createClient>;

  beforeAll(async () => {
    client = createClient({
      baseUrl,
      headers: {
        'suno-api-key': sunoApiKey!,
      }
    });
  }, 30000);

  test('should generate audio and run dependent tests', async () => {
    const prompt = `Generate a song about a cat with a flute`;
    console.log(`Generating audio for prompt: ${prompt}`);
    try {
      const { data: response } = await postApiGenerate({
        client,
        body: {
          prompt,
          make_instrumental: false,
          wait_audio: true,
        }
      });
      console.log("generated audio 1", response?.[0]);

      const generatedAudioId = (response as any)?.[0]?.id;
      console.log(`Generated audio with ID: ${generatedAudioId}`);
      expect(response).toBeDefined();
      expect((response as any)?.length).toBeGreaterThan(0);
      expect(generatedAudioId).toBeDefined();

      if (generatedAudioId) {
        test('should get audio information', async () => {
          console.log(`Getting info for audio ID: ${generatedAudioId}`);
          const { data: response } = await getApiGet({
            client,
            query: {
              ids: generatedAudioId
            }
          });
          console.log("get audio", response);
          expect(response).toBeDefined();
          expect((response as any)?.length).toBeGreaterThan(0);
          expect((response as any)?.[0]?.id).toBe(generatedAudioId);
        }, 30000);

        test('should extend audio', async () => {
          console.log(`Extending audio ID: ${generatedAudioId}`);
          const { data: response } = await postApiExtendAudio({
            client,
            body: {
              audio_id: generatedAudioId,
            }
          });
          console.log("extend audio", response);
          expect(response).toBeDefined();
        }, 120000);

        test('should generate stems', async () => {
          console.log(`Generating stems for audio ID: ${generatedAudioId}`);
          const { data: response } = await postApiGenerateStems({
            client,
            body: {
              audio_id: generatedAudioId,
            }
          });
          console.log("generate stems", response);
          expect(response).toBeDefined();
        }, 120000);

        test('should get aligned lyrics', async () => {
          console.log(`Getting aligned lyrics for song ID: ${generatedAudioId}`);
          const { data: response } = await getApiGetAlignedLyrics({
            client,
            query: {
              song_id: generatedAudioId,
            }
          });
          console.log("get aligned lyrics", response);
          expect(response).toBeDefined();
        }, 30000);

        test('should get clip information', async () => {
          console.log(`Getting clip info for ID: ${generatedAudioId}`);
          const { data: response } = await getApiClip({
            client,
            query: {
              id: generatedAudioId,
            }
          });
          console.log("get clip", response);
          expect(response).toBeDefined();
          expect((response as any)?.id).toBe(generatedAudioId);
        }, 30000);

        test('should concat audio', async () => {
          console.log(`Concatenating from clip ID: ${generatedAudioId}`);
          const { data: response } = await postApiConcat({
            client,
            body: {
              clip_id: generatedAudioId,
            }
          });
          console.log("concat", response);
          expect(response).toBeDefined();
          expect((response as any)?.id).toBeDefined();
        }, 120000);
      }
    } catch (e) {
      console.log("Error in first test block", e);
      throw e;
    }
  }, 120000);

  test('should generate audio in custom mode', async () => {
    const prompt = `Generate a song about a cat with a guitar`;
    const tags = 'acoustic pop';
    const title = `test-custom-${randomBytes(4).toString('hex')}`;
    console.log(`Generating custom audio for title: ${title}`);
    const { data: response } = await postApiCustomGenerate({
      client,
      body: {
        prompt,
        tags,
        title,
        make_instrumental: false,
        wait_audio: true,
      }
    });
    console.log("custom generate", response);
    expect(response).toBeDefined();
    expect((response as any)?.length).toBeGreaterThan(0);
    expect((response as any)?.[0]?.id).toBeDefined();
    console.log(`Generated custom audio with ID: ${(response as any)?.[0]?.id}`);
  }, 120000);

  test('should generate audio with OpenAI compatibility', async () => {
    const prompt = `Generate a song about a cat with a piano`;
    console.log(`Generating audio (OpenAI compat) for prompt: ${prompt}`);
    const { data: response } = await postV1ChatCompletions({
      client,
      body: {
        prompt,
      }
    });
    console.log("openai", response);
    expect(response).toBeDefined();
    expect((response as any)?.data).toBeDefined();
  }, 120000);

  test('should get API limit', async () => {
    console.log(`Getting API limit`);
    const { data: response } = await getApiGetLimit({ client });
    console.log("get limit", response);
    expect(response).toBeDefined();
    expect(typeof (response as any)?.credits_left).toBe('number');
  }, 30000);

  test('should generate lyrics', async () => {
    const prompt = `Generate a song about a cat with a guitar`;
    console.log(`Generating lyrics for prompt: ${prompt}`);
    const { data: response } = await postApiGenerateLyrics({
      client,
      body: {
        prompt,
      }
    });
    console.log("generate lyrics", response);
    expect(response).toBeDefined();
    expect((response as any)?.text).toBeDefined();
    expect((response as any)?.title).toBeDefined();
  }, 30000);

  test('should get persona information', async () => {
    console.log("getting persona");
    const { data: response } = await getApiPersona({
      client,
      query: {
        id: "1eb56ac8-9318-4f51-ba5e-5a0bbf58c4c8",
      }
    });
    console.log("persona", response);
    expect(response).toBeDefined();
  }, 30000);
}); 