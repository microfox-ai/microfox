import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import inquirer from 'inquirer';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import { checkPackageNameAndPrompt } from '../utils/npmChecker';

async function createAgentProject(agentName: string): Promise<void> {
  const workingDir = getWorkingDirectory();
  const agentDir = path.join(workingDir, agentName);

  if (fs.existsSync(agentDir)) {
    throw new Error(`Directory already exists at ${agentDir}`);
  }

  console.log(
    chalk.blue(
      `🚀 Creating agent ${chalk.bold(agentName)} at ${agentDir}\n`,
    ),
  );

  fs.mkdirSync(agentDir, { recursive: true });

  const templatePath = path.resolve(__dirname, 'agent-template.txt');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  const fileSections = templateContent.split('--- filename: ').slice(1);

  for (const section of fileSections) {
    const lines = section.split('\n');
    const filePath = lines.shift()!.trim();
    const content = lines.join('\n').replace(/<%= agentName %>/g, agentName);
    
    const destPath = path.join(agentDir, filePath);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, content);
    console.log(chalk.green(`✅ Created ${filePath}`));
  }
}

async function createPackageProject(packageName: string): Promise<void> {
    const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;
    const titleName = simpleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    const description = `A TypeScript SDK for ${titleName}.`;
    const className = simpleName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('') + 'Sdk';

    const workingDir = getWorkingDirectory();
    const packageDir = path.join(workingDir, simpleName);

    if (fs.existsSync(packageDir)) {
        throw new Error(`Directory already exists at ${packageDir}`);
    }

    console.log(
        chalk.blue(
        `🚀 Creating package ${chalk.bold(packageName)} at ${packageDir}\n`,
        ),
    );
    
    fs.mkdirSync(packageDir, { recursive: true });

    const templatePath = path.resolve(__dirname, 'package-template.txt');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const fileSections = templateContent.split('--- filename: ').slice(1);

    for (const section of fileSections) {
        const lines = section.split('\n');
        const filePath = lines.shift()!.trim().replace(/<%= simpleName %>/g, simpleName);
        let content = lines.join('\n');

        content = content.replace(/<%= packageName %>/g, packageName);
        content = content.replace(/<%= simpleName %>/g, simpleName);
        content = content.replace(/<%= titleName %>/g, titleName);
        content = content.replace(/<%= description %>/g, description);
        content = content.replace(/<%= className %>/g, className);

        const destPath = path.join(packageDir, filePath);
        const destDir = path.dirname(destPath);

        if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        }

        fs.writeFileSync(destPath, content);
        console.log(chalk.green(`✅ Created ${filePath}`));
    }

    const docsDir = path.join(packageDir, 'docs');
    const docsConstructors = path.join(docsDir, 'constructors');
    const docsFunctions = path.join(docsDir, 'functions');

    fs.mkdirSync(docsDir, { recursive: true });
    fs.mkdirSync(docsConstructors, { recursive: true });
    fs.mkdirSync(docsFunctions, { recursive: true });
}

async function createBackgroundAgentProject(agentName: string): Promise<void> {
    const workingDir = getWorkingDirectory();
    const agentDir = path.join(workingDir, agentName);
  
    if (fs.existsSync(agentDir)) {
      throw new Error(`Directory already exists at ${agentDir}`);
    }
  
    console.log(
      chalk.blue(
        `🚀 Creating background agent ${chalk.bold(agentName)} at ${agentDir}\n`,
      ),
    );
  
    fs.mkdirSync(agentDir, { recursive: true });
  
    const templateDir = path.resolve(__dirname, 'background-agent');
  
    const copyTemplates = (src: string, dest: string) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name.replace(/\.txt$/, ''));
            
            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyTemplates(srcPath, destPath);
            } else if (entry.name.endsWith('.txt')) {
                const templateContent = fs.readFileSync(srcPath, 'utf-8');
                const content = templateContent.replace(/<%= agentName %>/g, agentName);
                fs.writeFileSync(destPath, content);
                console.log(chalk.green(`✅ Created ${path.relative(agentDir, destPath)}`));
            }
        }
    };
  
    copyTemplates(templateDir, agentDir);
}

export async function kickstartCommand(): Promise<void> {
  console.log(chalk.cyan("🚀 Let's kickstart your new project!\n"));

  const { boilerplateType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'boilerplateType',
      message: 'Select boilerplate type:',
      choices: ['package', 'agent'],
    },
  ]);

  if (!boilerplateType) {
    console.log(chalk.yellow('Operation cancelled.'));
    return;
  }

  if (boilerplateType === 'agent') {
    const { agentType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'agentType',
          message: 'Select agent type:',
          choices: ['plain', 'background'],
        },
      ]);
  
    if(agentType === 'plain'){
      const agentName = readlineSync.question(
        chalk.yellow('📦 Enter agent name: '),
      );
  
      if (!agentName.trim()) {
        throw new Error('Agent name cannot be empty');
      }
      await createAgentProject(agentName.trim());
  
      console.log(
          chalk.green(
            `\n🎉 Successfully created agent ${chalk.bold(agentName)}!`,
          ),
        );
        console.log(chalk.gray(`📍 Located at ${path.join(getWorkingDirectory(), agentName)}`));
        console.log(chalk.yellow('\n💡 Next steps:'));
        console.log(chalk.yellow(`   1. cd ${agentName}`));
        console.log(chalk.yellow('   2. npm install'));
        console.log(chalk.yellow('   3. Configure your env.json'));
        console.log(chalk.yellow('   4. npm run dev'));
        console.log(chalk.yellow('   5. Start developing your agent!'));

    } else if (agentType === 'background') {
      const agentName = readlineSync.question(
        chalk.yellow('📦 Enter agent name: '),
      );
  
      if (!agentName.trim()) {
        throw new Error('Agent name cannot be empty');
      }
      await createBackgroundAgentProject(agentName.trim());

      console.log(
        chalk.green(
          `\n🎉 Successfully created background agent ${chalk.bold(agentName)}!`,
        ),
      );
      console.log(chalk.gray(`📍 Located at ${path.join(getWorkingDirectory(), agentName)}`));
      console.log(chalk.yellow('\n💡 Next steps:'));
      console.log(chalk.yellow(`   1. cd ${agentName}`));
      console.log(chalk.yellow('   2. npm install'));
      console.log(chalk.yellow('   3. Configure your env.json'));
      console.log(chalk.yellow('   4. npm run dev'));
      console.log(chalk.yellow('   5. Start developing your agent!'));
    }

  } else if (boilerplateType === 'package') {
    // Ask for package name interactively
    const packageName = readlineSync.question(
      chalk.yellow('📦 Enter package name: '),
    );

    if (!packageName.trim()) {
      throw new Error('Package name cannot be empty');
    }

    // Check npm availability and get final package name
    const finalPackageName = await checkPackageNameAndPrompt(packageName.trim());
    await createPackageProject(finalPackageName);

    const simpleName = finalPackageName.includes('/')
    ? finalPackageName.split('/')[1]
    : finalPackageName;

    console.log(
      chalk.green(
        `\n🎉 Successfully created package ${chalk.bold(finalPackageName)}!`,
      ),
    );
    console.log(chalk.gray(`📍 Located at ${path.join(getWorkingDirectory(), simpleName)}`));
    console.log(chalk.yellow('\n💡 Next steps:'));
    console.log(chalk.yellow(`   1. cd ${simpleName}`));
    console.log(chalk.yellow('   2. npm install'));
    console.log(chalk.yellow('   3. npm run build'));
    console.log(chalk.yellow('   4. npm test'));
    console.log(chalk.yellow('   5. Start developing your SDK!'));
    console.log(
      chalk.gray(
        `\n📚 Your package is ready to be published to npm as "${finalPackageName}"`,
      ),
    );
  } else {
    console.log(chalk.red('Invalid boilerplate type selected. Please choose "package" or "agent".'));
  }
}
