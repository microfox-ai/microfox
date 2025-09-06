import { Caption } from "./schemas";

// --- Configuration ---
const MAX_WORDS_PER_CAPTION = 5;
const LONG_PAUSE_THRESHOLD_S = 3;

export function processCaptions(captions: Caption[]): Caption[] {
  // Step 1: Break up captions with too many words
  const captionsChunkedByWordCount: Caption[] = [];
  captions.forEach((caption) => {
    if (caption.words.length > MAX_WORDS_PER_CAPTION) {
      let chunkIndex = 0;
      for (
        let i = 0;
        i < caption.words.length;
        i += MAX_WORDS_PER_CAPTION
      ) {
        const wordChunk = caption.words.slice(i, i + MAX_WORDS_PER_CAPTION);
        if (wordChunk.length > 0) {
          const newCaption: Caption = {
            id: `${caption.id}-chunk-${chunkIndex}`,
            text: wordChunk.map((w) => w.word).join(" "),
            startTime: wordChunk[0].startTime,
            endTime: wordChunk[wordChunk.length - 1].endTime,
            words: wordChunk,
          };
          captionsChunkedByWordCount.push(newCaption);
          chunkIndex++;
        }
      }
    } else {
      captionsChunkedByWordCount.push(caption);
    }
  });

  // Step 2: Split captions that have long pauses between words
  const processedCaptions: Caption[] = [];
  captionsChunkedByWordCount.forEach((caption) => {
    if (caption.words.length < 2) {
      processedCaptions.push(caption);
      return;
    }

    const wordChunks: (typeof caption.words[0])[][] = [];
    let currentChunk: (typeof caption.words[0])[] = [caption.words[0]];

    for (let i = 1; i < caption.words.length; i++) {
      const prevWord = caption.words[i - 1];
      const currentWord = caption.words[i];

      if (currentWord.startTime - prevWord.endTime > LONG_PAUSE_THRESHOLD_S) {
        wordChunks.push(currentChunk);
        currentChunk = [currentWord];
      } else {
        currentChunk.push(currentWord);
      }
    }
    wordChunks.push(currentChunk);

    if (wordChunks.length === 1) {
      processedCaptions.push(caption);
    } else {
      wordChunks.forEach((chunk, index) => {
        const newCaption: Caption = {
          id: `${caption.id}-split-${index}`,
          text: chunk.map((w) => w.word).join(" "),
          startTime: chunk[0].startTime,
          endTime: chunk[chunk.length - 1].endTime,
          words: chunk,
        };
        processedCaptions.push(newCaption);
      });
    }
  });

  return processedCaptions;
} 