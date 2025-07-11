import * as fs from 'fs';
import * as path from 'path';


export function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);

    if (entry.isDirectory()) {
      const destPath = path.join(dest, entry.name);
      copyDirectory(srcPath, destPath);
    } else {
      let destFileName = entry.name;
      if (entry.name.endsWith('.txt')) {
        const baseName = entry.name.replace('.txt', '');
        const extensionMap: { [key: string]: string } = {
          package: 'package.json',
          tsconfig: 'tsconfig.json',
          eslint: 'eslint.config.js',
          serverless: 'serverless.yml',
          openapi: 'openapi.json',
          sdkInit: 'sdkInit.ts',
          index: 'index.ts',
        };
        destFileName = extensionMap[baseName] || `${baseName}.txt`;
      }

      const destPath = path.join(dest, destFileName);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function updateTemplateFiles(
  slsDir: string,
  packageName: string,
  description: string,
): void {
  // Update package.json
  const packageJsonPath = path.join(slsDir, 'package.json');
  const parentPackageJsonPath = path.join(slsDir, '..', 'package.json');
  const parentPackageJson = JSON.parse(
    fs.readFileSync(parentPackageJsonPath, 'utf8'),
  );
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = `public-${packageName}-api`;
    packageJson.description = description;
    packageJson.dependencies['@microfox/tool-core'] = `^1.0.1`;
    packageJson.dependencies[parentPackageJson.name] =
      `^${parentPackageJson.version}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated package.json for ${packageJson.name}`);
  }

  // Update serverless.yml
  const serverlessPath = path.join(slsDir, 'serverless.yml');
  if (fs.existsSync(serverlessPath)) {
    let serverlessContent = fs.readFileSync(serverlessPath, 'utf8');
    serverlessContent = serverlessContent.replace(
      /^service:\s+.+$/m,
      `service: public-${packageName}-api`,
    );
    fs.writeFileSync(serverlessPath, serverlessContent);
    console.log(
      `✅ Updated serverless.yml for public-${packageName}-api`,
    );
  }
}