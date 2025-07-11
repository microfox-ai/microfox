import { AiMiddleware } from '@microfox/ai-router';
import * as fs from 'fs';
import * as path from 'path';
import { getProjectRoot } from '@/lib/helpers/utils';

export const getPackageInfo: AiMiddleware<any> = async (ctx, next) => {
  let { packageName } = ctx.request.params
  if (!packageName) {
    return next();
  }

  const taskContext = ctx.state;
  packageName = packageName.replace('@microfox/', '');
  if (taskContext[packageName] && taskContext[packageName].packageInfo) {
    ctx.response.write({ type: 'text', text: `Package info already initialized for: ${packageName}` });
  }

  try {
    // 1. Initialize Paths
    taskContext.projectRoot = await getProjectRoot();
    taskContext[packageName] = {
      ...taskContext[packageName],
      packageDir: path.join(taskContext.projectRoot, 'packages', packageName),
      slsDir: path.join(taskContext.projectRoot, 'packages', packageName, 'sls'),
      docsDir: path.join(taskContext.projectRoot, 'packages', packageName, 'docs'),
    };

    // 2. Read package-info.json
    const packageInfoPath = path.join(taskContext[packageName].packageDir, 'package-info.json');
    if (!fs.existsSync(packageInfoPath)) {
      throw new Error(`Package info not found: ${packageInfoPath}`);
    }
    const packageInfoContent = fs.readFileSync(packageInfoPath, 'utf8');
    taskContext[packageName]['packageInfo'] = JSON.parse(packageInfoContent);
    ctx.state = taskContext;
    return next();
  } catch (error: any) {
    ctx.response.write({ type: 'text', text: `Error initializing context: ${error.message}` });
  }
}