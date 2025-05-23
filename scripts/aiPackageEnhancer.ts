import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { globSync } from 'glob';

// Configure environment
config({ path: path.join(__dirname, '.env') });

// Initialize Gemini with enhanced settings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.3,  // More factual outputs
        maxOutputTokens: 120
    }
});


async function generateDescription(packageName: string): Promise<string> {
    const prompt = `Create a technical one-line description (12-15 words) for "${packageName}" TypeScript SDK. 
                 Focus on its core API functionality. Example: "AWS client for S3 bucket operations".
                 Do not use placeholders like [...] or ...`;

    try {
        const result = await model.generateContent(prompt);
        return (await result.response).text().trim();
    } catch (error) {
        console.error('API Error:', error instanceof Error ? error.message : 'Unknown error');
        return '';
    }
}

async function enhancePackageInfo(filePath: string): Promise<boolean> {
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const relPath = path.relative(process.cwd(), filePath);

        // Skip if description exists and doesn't contain placeholder
        if (content.description && !content.description.includes('No description')) {
            console.log(`⏩ Skipping (has description): ${relPath}`);
            return false;
        }

        const packageName = path.basename(path.dirname(filePath));
        const newDesc = await generateDescription(packageName);

        if (!newDesc) {
            console.log(`⚠️  Empty description for: ${relPath}`);
            return false;
        }

        content.description = newDesc;
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        console.log(`✏️  Updated: ${relPath}\n   New description: "${newDesc}"`);
        return true;

    } catch (err) {
        console.error(`❌ Failed to process ${filePath}:`, err instanceof Error ? err.message : String(err));
        return false;
    }
}

// Main execution
(async () => {
    try {
        const packageInfoFiles = globSync(path.join(process.cwd(), '../packages/**/package-info.json'));
        console.log(`📦 Found ${packageInfoFiles.length} package files`);

        let updates = 0;
        for (const file of packageInfoFiles) {
            if (await enhancePackageInfo(file)) updates++;
        }

        console.log(`\n✅ Completed. Updated ${updates}/${packageInfoFiles.length} packages`);
        process.exit(0);

    } catch (err) {
        console.error('❌ Fatal error:', err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
})();