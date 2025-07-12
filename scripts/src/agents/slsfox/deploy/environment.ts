import fs from "fs";
import path from "path";
import { STAGE } from "./constants";

/**
 * Set environment variables in process.env
 * @param {string} functionDir - The directory of the function
 */
function setEnvironmentVariables(functionDir: string) {
    // Set mode-specific variables
    process.env.NODE_ENV = STAGE
    process.env.STAGE = STAGE

    const envJson: Record<string, string> = {
        NODE_ENV: STAGE,
        STAGE: STAGE,
        MICROFOX_API_KEY: process.env.MICROFOX_API_KEY || "",
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "",
        TASK_UPSTASH_REDIS_REST_URL: process.env.TASK_UPSTASH_REDIS_REST_URL || "",
        TASK_UPSTASH_REDIS_REST_TOKEN: process.env.TASK_UPSTASH_REDIS_REST_TOKEN || "",
    }

    // write an env.json file in the same folder as serverless.yml
    const envFilePath = path.join(functionDir, 'env.json')
    fs.writeFileSync(envFilePath, JSON.stringify(envJson, null, 2))
}

export {
    setEnvironmentVariables,
}