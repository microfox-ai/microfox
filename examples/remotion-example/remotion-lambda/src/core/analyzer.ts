import { Caption, Word, AIEnhancedCaption } from "./schemas";
import { generateLayoutWithAI } from "./layout/tailwind-generator";
import { enrichLayoutWithTimings } from "./layout/ai-generator";

export async function analyzeCaption(
  caption: Caption,
  videoDimensions: { width: number, height: number },
  anthropicKey: string
): Promise<AIEnhancedCaption> {
  if (!caption.words || caption.words.length === 0) {
    throw new Error("Cannot analyze a caption with no words.");
  }

  // Find the focus word (longest duration)
  const focusWord = caption.words.reduce((longest: Word, current: Word) => {
    const longestDuration = (longest.endTime || 0) - (longest.startTime || 0);
    const currentDuration = (current.endTime || 0) - (current.startTime || 0);
    return currentDuration > longestDuration ? current : longest;
  });

  const layout = await generateLayoutWithAI({
    sentence: caption.text,
    focus_word: focusWord.word,
    targets: videoDimensions,
    background_color: 'bg-transparent', // Assuming transparent background for overlay
  }, anthropicKey);

  // 6. Enrich the generated layout with word timings
  console.log('Enriching layout with word timings...');
  const timedLayout = enrichLayoutWithTimings(layout, caption.words);

  return {
    ...caption,
    focusWord: focusWord.word,
    layout: {
      name: "ai-generated", // Provide a name for the layout object
      root: timedLayout, // Assign the generated layout to the 'root' property
    },
  };
} 