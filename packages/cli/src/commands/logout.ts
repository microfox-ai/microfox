import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import { authHeaders, clearCredentials, getCicdBaseUrl, getCredentials } from '../utils/auth';

export const logoutCommand = new Command()
  .name('logout')
  .description('Log out the Microfox CLI and revoke its token')
  .option('--mode <mode>', 'API mode (prod|staging)', 'prod')
  .option('--port <port>', 'Local cicd port (for local development)')
  .action(async (options: { mode?: string; port?: string }) => {
    const creds = getCredentials();
    if (!creds?.token) {
      console.log(chalk.yellow('Not logged in.'));
      return;
    }
    const base =
      creds.cicdBase ||
      getCicdBaseUrl({ mode: options.mode, port: options.port ? Number(options.port) : undefined });
    try {
      await axios.post(`${base}/api/auth/cli/revoke`, {}, { headers: authHeaders(), validateStatus: () => true });
    } catch {
      // best-effort revoke; we clear local creds regardless
    }
    clearCredentials();
    console.log(chalk.green('✅ Logged out.'));
  });
