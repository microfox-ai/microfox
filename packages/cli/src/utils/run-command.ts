import { execa } from 'execa';

export async function runCommand(command: string, args: string[]) {
  try {
    await execa(command, args, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to run command: ${command} ${args.join(' ')}`);
  }
}
