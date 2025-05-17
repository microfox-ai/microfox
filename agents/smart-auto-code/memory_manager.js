import fs from "fs-extra";

const MEMORY_FILE = "./memory/logs.json";

export async function saveToMemory(prompt, code) {
  await fs.ensureFile(MEMORY_FILE);

  let data = [];
  try {
    const raw = await fs.readFile(MEMORY_FILE, "utf-8");
    data = JSON.parse(raw || "[]");
  } catch {
    data = [];
  }

  data.push({ prompt, code });

  await fs.writeFile(MEMORY_FILE, JSON.stringify(data, null, 4));
  console.log("Prompt and code saved to memory.");
}