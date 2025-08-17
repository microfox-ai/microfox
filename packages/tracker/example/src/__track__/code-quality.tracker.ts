import { defineTracker } from '@microfox/tracker';
import type { TrackerLogic } from '@microfox/tracker';
import * as path from 'path';

const logic: TrackerLogic = async ({ project, log }) => {
    log.info('Running code quality checks...');
    
    const sourceFiles = project.getSourceFiles();
    let issuesFound = 0;

    for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath();
        // We don't want to scan files in node_modules or our own tracker files
        if (filePath.includes('node_modules') || filePath.includes('__track__')) {
            continue;
        }

        const text = sourceFile.getFullText();
        const lines = text.split('\n');

        lines.forEach((line, index) => {
            if (line.includes('console.log')) {
                log.warn(`Found 'console.log' in ${path.basename(filePath)} on line ${index + 1}`);
                issuesFound++;
            }
        });
    }

    if (issuesFound > 0) {
        log.error(`Code quality check failed: Found ${issuesFound} instances of 'console.log'.`);
        // In a real CI/CD environment, you might want to fail the build here.
        // For this example, we'll just log an error.
    } else {
        log.info('Code quality check passed. No "console.log" statements found.');
    }
};

export default defineTracker(
    {
        // This tracker targets all .ts files in the src directory, excluding trackers
        targets: ['src/**/*.ts', '!src/__track__/**/*.ts'],
        github: {
            name: 'Run Code Quality Checks',
            on: {
                push: {
                    branches: ['main'],
                },
            },
            env: {
                NODE_ENV: 'test',
                API_KEY: '${{ secrets.API_KEY }}',
            },
        }
    },
    logic
); 