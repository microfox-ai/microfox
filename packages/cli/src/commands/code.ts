import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import { spawn, ChildProcess } from 'child_process';
import { findProjectRoot } from '../utils/findProjectRoot';
import path from 'path';
import readline from 'readline';

const NEXTJS_PORT = 3000;
const API_URL = `http://localhost:${NEXTJS_PORT}/api/agent`;

const createLogger = (rl: readline.Interface) => {
    return (source: string, message: string, color: typeof chalk) => {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);

        const prefix = color(`[${source}]`);
        
        const lines = message.trim().split('\n');
        for (const line of lines) {
            console.log(`${prefix} ${line}`);
        }
        
        rl.prompt(true);
    };
};

async function codeAction(): Promise<void> {
  let childProcess: ChildProcess | null = null;
  
  const killProcess = () => {
    if (childProcess && childProcess.pid) {
      console.log(chalk.yellow('\nGracefully shutting down...'));
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', childProcess.pid.toString(), '/f', '/t']);
      } else {
        childProcess.kill('SIGINT');
      }
      childProcess = null;
    }
  };

  process.on('SIGINT', () => {
    killProcess();
    process.exit(0);
  });
  process.on('exit', killProcess);


  try {
    const projectRoot = await findProjectRoot();
    if (!projectRoot) {
      console.error(
        chalk.red('Error: Could not find project root. Make sure you are inside a Microfox project.')
      );
      process.exit(1);
    }

    const codeAppPath = path.join(projectRoot, 'apps', 'code');
    
    console.log(chalk.cyan(`Starting Next.js server in ${codeAppPath}...`));
    
    childProcess = spawn('npm', ['run', 'dev'], {
      cwd: codeAppPath,
      shell: true,
      env: { ...process.env, FORCE_COLOR: 'true' }
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.cyan('> ')
    });

    const log = createLogger(rl);
    
    let serverReady = false;

    const onServerData = (data: Buffer) => {
        const output = data.toString();
        if (!serverReady) {
            process.stdout.write(output);
            if (output.toLowerCase().includes('ready in') || output.toLowerCase().includes('compiled successfully')) {
                serverReady = true;
                console.log(chalk.green('\nServer is ready. You can now type your queries.'));
                rl.prompt();
            }
        } else {
            log('nextjs', output, chalk.gray);
        }
    };

    childProcess.stdout?.on('data', onServerData);
    childProcess.stderr?.on('data', onServerData);

    childProcess.on('exit', (code) => {
        log('system', `Next.js process exited with code ${code}`, chalk.red);
        process.exit(code ?? 1);
    });

    rl.on('line', async (line) => {
        const query = line.trim();
        if (!serverReady) {
            log('system', 'Server is not ready yet, please wait.', chalk.yellow);
            rl.prompt();
            return;
        }
        if (query.toLowerCase() === 'exit') {
           rl.close();
        }
        if (query) {
            try {
                const response = await axios.post(API_URL, { prompt: query });
                const responseData = typeof response.data === 'object' 
                    ? JSON.stringify(response.data, null, 2) 
                    : response.data;
                
                log('agent', responseData, chalk.green);

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    log('agent', `Error: ${error.message}`, chalk.red);
                } else if (error instanceof Error) {
                    log('agent', `An unknown error occurred: ${error.message}`, chalk.red);
                }
            }
        }
        rl.prompt();
    });

    rl.on('close', () => {
        killProcess();
        process.exit(0);
    });

  } catch (error) {
    killProcess();
    if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

export const codeCommand = new Command('code')
    .description('Run the code agent for your project')
    .action(async () => {
        try {
            await codeAction();
        } catch (error) {
            console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    }); 