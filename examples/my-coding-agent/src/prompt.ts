// prompt.ts
// This module is responsible for handling and structuring prompts or tasks from the user.

export interface Task {
  id: string;
  input: string;
  language: string;
  createdAt: Date;
}

// Infers language from user input or defaults to Python
function inferLanguage(input: string): string {
  const knownLanguages = [
    "python", "javascript", "typescript", "java", "c++", "c#",
    "go", "rust", "ruby", "php", "swift", "kotlin", "scala"
  ];

  const match = knownLanguages.find(lang =>
    input.toLowerCase().includes(lang)
  );

  return match ?? "python";
}

export function createPrompt(input: string): Task {
  return {
    id: crypto.randomUUID(),
    input,
    language: inferLanguage(input),
    createdAt: new Date(),
  };
}

export function formatPrompt(task: Task): string {
  return `Task ID: ${task.id}\nLanguage: ${task.language}\nCreated At: ${task.createdAt}\n\n${task.input}`;
}
