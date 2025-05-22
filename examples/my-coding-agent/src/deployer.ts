// deployer.ts
// Deploys generated code or text output to a file with the correct extension.

import fs from "fs";
import path from "path";
import { log } from "./utils/logger";

// Maps known programming languages to file extensions
function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    python: "py",
    javascript: "js",
    typescript: "ts",
    java: "java",
    "c++": "cpp",
    "c#": "cs",
    go: "go",
    rust: "rs",
    ruby: "rb",
    php: "php",
  };

  // Default to .txt if language is not recognized
  return extensions[language.toLowerCase()] || "py";
}

export function deployCode(code: string, taskId: string, language: string): string {
  const extension = getFileExtension(language);
  const outputDir = path.join(__dirname, "generated");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, `${taskId}.${extension}`);
  fs.writeFileSync(filePath, code);

  log(`Output deployed to ${filePath}`);
  return filePath;
}
