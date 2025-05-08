import OpenAI from "openai";
import * as fs from "fs/promises";
import { execSync } from "child_process";
import path from "path";
import readline from "readline";
import 'dotenv/config';
import type { ChatCompletionMessageParam } from "openai/resources/chat";


// Setup & Get CLI Input


const token = process.env["GITHUB_TOKEN"];
if (!token) {
  throw new Error("Missing GITHUB_TOKEN in environment variables.");
}

async function getUserPrompt(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question("💬 Enter the task you want the agent to generate code for:\n> ", (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}


// Get Previous History Context (if any)

async function getLastHistoryEntry(): Promise<{ prompt: string; code: string } | null> {
  const historyFile = "history.json";
  try {
    const data = await fs.readFile(historyFile, "utf8");
    const history = JSON.parse(data);
    if (history.length > 0) {
      return history[history.length - 1];
    }
  } catch {
    // ignore if no history
  }
  return null;
}


// 🚀 Phase 2: Generate Code via OpenAI (with Phase 5 integration)


async function generateCodeFromOpenAI(userPrompt: string): Promise<string> {
  const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token,
  });

  console.log("⏳ Generating code from OpenAI…");

  // Get the last history entry to use as context
  const previous = await getLastHistoryEntry();

  // Create the messages array for the prompt
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful coding assistant. When asked to generate code, ONLY return the raw code as plain text without any Markdown formatting or code blocks. DO NOT use triple backticks (```). Comments should be inline using // style. Do not explain, do not wrap, and do not add any extra text before or after the code.",
    },
  ];

  // Add the previous task and code if it exists
  if (previous) {
    messages.push({
      role: "assistant",
      content: `Previous task:\n${previous.prompt}\n\nPrevious code:\n${previous.code}`,
    });
  }

  // Add the new user prompt
  messages.push({
    role: "user",
    content: userPrompt,
  });

  try {
    // Request code generation from the model
    const response = await client.chat.completions.create({
      messages,
      model: "openai/gpt-4o",  // Ensure you're using the correct model
      temperature: 0.7,
      max_tokens: 2048,
    });

    // Extract the code from the response
    const code = response.choices[0].message.content;
    if (!code) throw new Error("No code returned by the model.");
    return code;
  } catch (error) {
    console.error("❌ Error during code generation:", error);
    throw error;
  }
}


// Write Code to File & Push to GitHub


async function writeAndPushCode(code: string) {
  const filePath = path.join("generated-code", "api.ts");

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, code);
  console.log(`✅ Code written to ${filePath}`);

  try {
    const unstaged = execSync("git status --porcelain").toString().trim();
    let didStash = false;

    if (unstaged) {
      console.log("🧺 Stashing local changes...");
      execSync("git stash", { stdio: "inherit" });
      didStash = true;
    }

    console.log("📦 Pulling latest changes from GitHub...");
    execSync("git pull origin main --rebase", { stdio: "inherit" });

    if (didStash) {
      console.log("🔄 Re-applying stashed changes...");
      execSync("git stash pop", { stdio: "inherit" });
    }

 
    //  Branch Handling

    const branchName = "auto-generated-code";
    const branches = execSync("git branch", { encoding: "utf-8" });
    const branchExists = branches.includes(branchName);

    if (branchExists) {
      console.log(`🌿 Switching to existing branch: ${branchName}`);
      execSync(`git checkout ${branchName}`, { stdio: "inherit" });
    } else {
      console.log(`🌿 Creating and switching to new branch: ${branchName}`);
      execSync(`git checkout -b ${branchName}`, { stdio: "inherit" });
    }

    console.log("📦 Committing and pushing to GitHub…");
    execSync("git add ./generated-code", { stdio: "inherit" });
    execSync(
      `git commit -m "🤖 Generated code: ${new Date().toISOString()}"`,
      { stdio: "inherit" }
    );
    // Pull remote branch updates before pushing
    console.log(`🔄 Rebasing onto latest remote '${branchName}'...`);
    execSync(`git pull origin ${branchName} --rebase`, { stdio: "inherit" });
    
    execSync(`git push origin ${branchName}`, { stdio: "inherit" });

    console.log("🚀 Pushed to GitHub successfully.");
  } catch (error) {
    console.error("❌ Git operations failed:", error);
  }
}


// Store prompt & output to history.json
async function storeInHistory(prompt: string, code: string) {
  const historyFile = "history.json";
  let history: any[] = [];

  try {
    const data = await fs.readFile(historyFile, "utf8");
    history = JSON.parse(data);
  } catch {
    // If file doesn't exist, we'll create it later
    history = [];
  }

  history.push({
    timestamp: new Date().toISOString(),
    prompt,
    code,
  });

  await fs.writeFile(historyFile, JSON.stringify(history, null, 2));
  console.log("📚 Task and code saved to history.json");
}


//  Main Execution Flow


export async function main() {
  try {
    const userPrompt = await getUserPrompt();
    const code = await generateCodeFromOpenAI(userPrompt);
    await writeAndPushCode(code);
    await storeInHistory(userPrompt, code); // ✅ Phase 4 call
  } catch (err) {
    console.error("❌ The agent encountered an error:", err);
  }
}

main().catch((err)=>{
  console.error("error in the agent: ",err);
});
