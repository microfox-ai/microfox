import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import { getProjectRoot } from "./utils/getProjectRoot";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function getEnvFromTemplate() {
  const packagePath = process.argv[2];

  if (!packagePath) {
    console.error("Please provide a path to the package as an argument.");
    process.exit(1);
  }

  const packageJsonPath = path.resolve(packagePath, "package.json");

  let packageName: string;
  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);
    packageName = packageJson.name;
  } catch (error) {
    console.error(`Error reading package.json at ${packageJsonPath}:`, error);
    process.exit(1);
  }

  const { BASE_FOXHUB_URL, MICROFOX_TEMPLATE_API_KEY, MICROFOX_API_KEY } = process.env;

  if (!BASE_FOXHUB_URL || !MICROFOX_TEMPLATE_API_KEY || !MICROFOX_API_KEY) {
    console.error(
      "Please ensure BASE_FOXHUB_URL, MICROFOX_TEMPLATE_API_KEY and MICROFOX_API_KEY are set in your .env file."
    );
    process.exit(1);
  }

  const apiUrl = `${BASE_FOXHUB_URL}/api/client-secrets/get-template`;

  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "MicrofoxTemplateApiKey": MICROFOX_TEMPLATE_API_KEY,
        "microfox-api-key": MICROFOX_API_KEY,
      },
      body: JSON.stringify({
        packageName,
        templateType: "testing",
      }),
    };
    console.log("requestOptions", requestOptions);
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorData}`
      );
    }

    const templates: { variables: { key: string, value: string }[] }[] = await response.json();
    console.log("templates", templates);

    if (!templates || !templates[0].variables || templates[0].variables.length === 0) {
      console.log("No environment templates found for this package.");
      return;
    }

    const envContent = templates[0].variables.map((t) => `${t.key}=${t.value}`).join("\n");

    const envFilePath = path.resolve(packagePath, ".env");

    await fs.writeFile(envFilePath, envContent);

    console.log(`Successfully created .env file at ${envFilePath}`);
  } catch (error) {
    console.error("Error fetching or saving environment templates:", error);
    process.exit(1);
  }
}

getEnvFromTemplate(); 