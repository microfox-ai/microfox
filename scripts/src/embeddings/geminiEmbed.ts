import dotenv from 'dotenv';
dotenv.config();

// const EMBEDDING_MODEL = 'gemini-embedding-exp-03-07';  // 3072-dim
const EMBEDDING_MODEL = 'text-embedding-004'; // 768 dims
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const MAX_PAYLOAD_SIZE = 32000; // Maximum payload size in bytes

function sliceTextToMaxSize(text: string): string {
  const encoder = new TextEncoder();
  let currentText = text;

  while (encoder.encode(currentText).length > MAX_PAYLOAD_SIZE) {
    // Remove last character until we're under the limit
    currentText = currentText.slice(0, -1);
  }

  return currentText;
}

export async function embed(text: string): Promise<number[]> {
  // Slice text if it exceeds the maximum payload size
  const processedText = sliceTextToMaxSize(text);
  console.log('processedText', processedText.length);

  const url = `${GEMINI_BASE_URL}/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: {
        parts: [{ text: processedText }],
      },
    }),
  });
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(
      `Gemini error: ${payload.error?.message || res.statusText}`,
    );
  }

  return payload.embedding.values as number[];
}
