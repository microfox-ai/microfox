import { AiMiddleware } from '@microfox/ai-router';
import * as fs from 'fs';
import * as path from 'path';
import { getProjectRoot } from '@/lib/helpers/utils';

export const getPackageDocs: AiMiddleware<any> = async (ctx, next) => {
    let { packageName } = ctx.request.params;
    if (!packageName) {
        return next();
    }
    const taskContext = ctx.state;
    packageName = packageName.replace('@microfox/', '');
    if (taskContext[packageName] && taskContext[packageName].docs) {
        ctx.response.write({ type: 'text', text: `Package docs already initialized for: ${packageName}` });
    }
    try {
        // 1. Initialize Paths
        taskContext.projectRoot = getProjectRoot();
        taskContext[packageName] = {
            ...taskContext[packageName],
            packageDir: path.join(taskContext.projectRoot, 'packages', packageName),
            slsDir: path.join(taskContext.projectRoot, 'packages', packageName, 'sls'),
            docsDir: path.join(taskContext.projectRoot, 'packages', packageName, 'docs'),
        };

        // 2. Read package-info.json
        const docsDir = taskContext[packageName].docsDir;
        if (!fs.existsSync(docsDir)) {
            throw new Error(`Docs directory not found: ${docsDir}`);
        }
        taskContext[packageName].docs = {
            path: docsDir,
            constructors: fs.readdirSync(path.join(docsDir, 'constructors')).reduce((acc, file) => {
                acc[file.replace('.md', '') as string] = fs.readFileSync(path.join(docsDir, 'constructors', file), 'utf8');
                return acc;
            }, {} as Record<string, string>),
            functions: fs.readdirSync(path.join(docsDir, 'functions')).reduce((acc, file) => {
                acc[file.replace('.md', '') as string] = fs.readFileSync(path.join(docsDir, 'functions', file), 'utf8');
                return acc;
            }, {} as Record<string, string>),
            rules: fs.readFileSync(path.join(docsDir, 'rules.md'), 'utf8'),
            main: fs.readFileSync(path.join(docsDir, 'main.md'), 'utf8')
        }
        ctx.state = taskContext;
        return next();
    } catch (error: any) {
        ctx.response.write({ type: 'text', text: `Error initializing context: ${error.message}` });
    }
}