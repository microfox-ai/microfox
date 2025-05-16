// examples/coding-agent/src/test-agent.ts

import { CodingAgent } from './agent';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';

// Load environment variables
dotenv.config();

async function testCodingAgent() {
    // Check if API key is available
    if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ Error: GOOGLE_API_KEY not found in environment variables');
        console.log('Please create a .env file with your Google API key:');
        console.log('GOOGLE_API_KEY=your_api_key_here');
        return;
    }

    console.log('🚀 Starting Coding Agent Test...\n');

    // Initialize the agent
    const agent = new CodingAgent({
        apiKey: process.env.GOOGLE_API_KEY,
        generateTests: true,
        includeDocs: true,
        defaultLanguage: 'typescript',
    });

    // Test cases
    const testCases = [
        {
            name: 'Simple Function',
            prompt: 'Create a TypeScript function that calculates the factorial of a number',
        }
    ];

    // Create output directory for test results
    const outputDir = path.join(__dirname, '..', 'test-results');
    try {
        await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
        console.error('Error creating output directory:', error);
    }

    // Run tests
    for (const [index, testCase] of testCases.entries()) {
        console.log(`\n📝 Test Case ${index + 1}: ${testCase.name}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
            console.log(`🎯 Prompt: "${testCase.prompt}"\n`);
            
            const startTime = Date.now();
            const result = await agent.processTask(testCase.prompt);
            const endTime = Date.now();

            console.log('✅ Code Generation Successful');
            console.log(`⏱️  Time taken: ${(endTime - startTime) / 1000} seconds\n`);

            // Save results to files
            const testCaseDir = path.join(outputDir, `test-case-${index + 1}`);
            await fs.mkdir(testCaseDir, { recursive: true });

            // Save code
            await fs.writeFile(
                path.join(testCaseDir, 'code.ts'),
                result.code
            );

            // Save documentation
            if (result.documentation) {
                await fs.writeFile(
                    path.join(testCaseDir, 'documentation.md'),
                    result.documentation
                );
            }

            // Save tests
            if (result.tests) {
                await fs.writeFile(
                    path.join(testCaseDir, 'tests.ts'),
                    result.tests
                );
            }

            // Save execution results
            if (result.executionResult) {
                await fs.writeFile(
                    path.join(testCaseDir, 'execution-result.json'),
                    JSON.stringify(result.executionResult, null, 2)
                );
            }

            // Print summary
            console.log('📊 Result Summary:');
            console.log('━━━━━━━━━━━━━━━━');
            console.log(`📝 Code Length: ${result.code.length} characters`);
            console.log(`📚 Documentation: ${result.documentation ? '✅' : '❌'}`);
            console.log(`🧪 Tests: ${result.tests ? '✅' : '❌'}`);
            console.log(`🚀 Execution: ${result.executionResult?.success ? '✅' : '❌'}`);
            
            if (result.executionResult?.error) {
                console.log(`⚠️  Execution Error: ${result.executionResult.error}`);
            }

            console.log(`\n💾 Results saved to: ${testCaseDir}`);

        } catch (error) {
            console.error(`❌ Error in test case ${index + 1}:`, error);
        }
    }

    console.log('\n🏁 Test Suite Completed!\n');
}

// Run the test
console.log('🔍 Checking environment...');
testCodingAgent().catch(error => {
    console.error('❌ Fatal error:', error);
});