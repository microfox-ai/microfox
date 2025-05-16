import axios from "axios";
import dotenv from "dotenv";
import fs from "fs/promises";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import { languageMap, languageMapRun } from "./data.js";

dotenv.config();
const execAsync = promisify(exec);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function extractCodeFromMarkdown(text) {
  const match = text.match(/```(?:[a-zA-Z]+)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

async function callGemini(prompt) {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: prompt }],
          role: "user"
        }
      ]
    });
     const rawText = response.data.candidates[0].content.parts[0].text;
     return extractCodeFromMarkdown(rawText);
  } catch (err) {
    return `# Error from Gemini: ${err.message}`;
  }
}

export async function generateCode(task) {
  const lowerTask = task.toLowerCase();
  let detectedLanguage = 'python';

  for (const [lang, keywords] of Object.entries(languageMap)) {
    if (keywords.some(keyword => lowerTask.includes(keyword))) {
      detectedLanguage = lang;
      break;
    }
  }

  return await callGemini(`Write a complete ${detectedLanguage} script for: ${task}`);
}
export async function runCode(code, task = '') {
  try {
    let detectedLanguage = 'python';
    const lowerTask = task.toLowerCase();

    for (const [lang, config] of Object.entries(languageMapRun)) {
      const langIndicators = [
        ...(config.indicators || []),
        ...(config.extensions.map(ext => ext.replace('.', '')))
      ];

      if (langIndicators.some(indicator => 
        lowerTask.includes(indicator))) {
            detectedLanguage = lang;
            break;
        }
    }

    const config = languageMapRun[detectedLanguage];
    const extension = config.extensions[0];
    const filename = `generated_code${extension}`;
    console.log(`Detected language: ${detectedLanguage}`);
    const outputBinary = 'output_executable';

    let finalCode = code;
    if (config.shebang && !code.trim().startsWith('#!')) {
      finalCode = `${config.shebang}\n${code}`;
    }
    await fs.writeFile(filename, finalCode, "utf-8");

    let runCommand;
    let runArgs = [];

    if (config.compile) {
        const isWindows = process.platform === 'win32';
        const exeName = isWindows ? `${outputBinary}.exe` : `./${outputBinary}`;
        const compileCommand = `${config.commands[0]} ${filename} -o ${outputBinary}`;
        await execAsync(compileCommand);
        runCommand = exeName;
        runArgs = [];
    } else if (config.needsProject) {
        runCommand = config.commands[0];
        runArgs = [];
    } else {
        runCommand = config.commands[0];
        runArgs = [filename];
    }

    const child = spawn(runCommand, runArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    return new Promise((resolve, reject) => {
      child.on('exit', (code) => {
        if (code === 0) {
          resolve({ success: true, output: '' });
        } else {
          reject({ success: false, output: `Process exited with code ${code}` });
        }
      });

      child.on('error', (err) => {
        reject({ success: false, output: err.message });
      });
    });
  } catch (e) {
    return { success: false, output: e.stderr || e.message };
  }
}

export async function improveCode(code, error) {
  const prompt = `The following code has an error: ${code} The error is: ${error} Please fix the error and return the corrected script.`;
  return await callGemini(prompt);
}