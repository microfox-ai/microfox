// my_agent/agent.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { generateCode } from './utils.js';

export class MyCodingAgent {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'output');
    this.maxAttempts = 5;
  }

  async acceptTask(userTaskPrompt) {
    const taskPrefix = `
You are a helpful senior developer.

If the task requires multiple source files, generate a JSON object where keys are file paths and values are the file contents, like this:

{
  "src/index.js": "...",
  "src/components/Navbar.js": "...",
  "src/styles/navbar.css": "..."
}

If the task is simple and only requires a single file, return just the code snippet as plain text, no JSON.

Do not include any explanations or extra text—only return the code or JSON.

Now, here is the user task:
`;

    const fullPrompt = taskPrefix + userTaskPrompt;
    console.log('Task received:\n' + userTaskPrompt);
    this.prompt = fullPrompt;
    this.code = await generateCode(fullPrompt);
  }

  async writeCode() {
    fs.mkdirSync(this.baseDir, { recursive: true });

    try {
      const files = JSON.parse(this.code);
      for (const [filepath, content] of Object.entries(files)) {
        const fullPath = path.join(this.baseDir, filepath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content);
      }
      console.log(`Generated multiple files in ${this.baseDir}`);
      this.generatedFiles = files;
    } catch (err) {
      const mainFile = path.join(this.baseDir, 'main.js');
      fs.writeFileSync(mainFile, this.code);
      console.log(`Generated single file ${mainFile}`);
      this.generatedFiles = { 'main.js': this.code };
    }
  }

  printCode() {
    console.log('\nGenerated Code:\n');
    for (const [filename, content] of Object.entries(this.generatedFiles)) {
      console.log(`\n// File: ${filename}\n${content}\n`);
    }
  }

  runCode() {
    const files = Object.keys(this.generatedFiles);

    const pyEntryCandidates = ['main.py', 'src/main.py']; // compatibility note
    const nodeEntryCandidates = ['src/index.js', 'index.js', 'main.js'];

    const entry = nodeEntryCandidates.find(f => files.includes(f));

    if (entry) {
      const entryPath = path.join(this.baseDir, entry);
      try {
        console.log(`\nRunning Node.js entry file ${entry}...\n`);
        const output = execSync(`node ${entryPath}`, { encoding: 'utf-8', timeout: 20000 });
        console.log('Code ran successfully:\n');
        console.log(output);
        return true;
      } catch (e) {
        console.log('Code execution failed with error:\n');
        console.log(e.stderr || e.message);
        this.lastError = e.stderr?.toString() || e.message;
        return false;
      }
    }

    console.log('No recognized entry file found to run the code. Skipping execution.');
    return true;
  }

  async selfImprove() {
    console.log('Attempting to fix the code using the error trace...');
    const improvedPrompt = `The following code failed with an error. Fix the code.

--- ORIGINAL TASK ---
${this.prompt}

--- ORIGINAL CODE ---
${this.code}

--- ERROR MESSAGE ---
${this.lastError}

Return only the corrected code, no explanations.
`;
    this.code = await generateCode(improvedPrompt);
    await this.writeCode();
  }

  async run(userPrompt) {
    await this.acceptTask(userPrompt);
    await this.writeCode();
    this.printCode();

    for (let i = 0; i < this.maxAttempts; i++) {
      const success = this.runCode();
      if (success) break;
      console.log(`Attempting fix #${i + 1}`);
      await this.selfImprove();
    }
  }
}
