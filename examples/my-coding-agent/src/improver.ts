// improver.ts
// This module accepts a previous version of code and applies improvements using OpenAI.

import { log } from "./utils/logger";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function improveCode(originalCode: string): Promise<string> {
  log("Calling OpenAI API to improve code...");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior developer tasked with improving the quality of code without changing its core logic.",
        },
        {
          role: "user",
          content: `Improve and refactor the following code:\n\n${originalCode}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const improved = response.choices[0].message.content ?? "";
    log("OpenAI returned improved code successfully.");
    return improved;
  } catch (err: any) {
    log("Error improving code with OpenAI: " + err.message);
    return originalCode;
  }
}
