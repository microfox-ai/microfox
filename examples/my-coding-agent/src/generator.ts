// generator.ts
// Uses OpenAI's API to generate code based on user prompt.
// Defaults to Python if no language is specified.

import { Task } from "./prompt";
import { log } from "./utils/logger";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to check if user specified a programming language
function inferLanguage(input: string): boolean {
  const knownLanguages = [
    "python", "javascript", "java", "c++", "c#", "typescript",
    "go", "rust", "ruby", "php", "swift", "kotlin", "scala"
  ];
  return knownLanguages.some(lang =>
    input.toLowerCase().includes(lang)
  );
}

export async function generateCode(task: Task): Promise<string> {
  log("Calling OpenAI API for code generation...");

  const userPrompt = inferLanguage(task.input)
    ? task.input
    : `Write this in Python:\n${task.input}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Change to "gpt-3.5-turbo" if needed
      messages: [
        {
          role: "system",
          content: "You are a helpful coding assistant. Respond only with valid code and no explanations.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    const generated = response.choices[0].message.content ?? "";
    log("OpenAI responded successfully.");
    return generated;
  } catch (err: any) {
    log("Error calling OpenAI: " + err.message);
    return "// Error generating code. Please check the logs.";
  }
}
