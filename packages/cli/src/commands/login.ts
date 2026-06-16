import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import { spawn } from 'child_process';
import { getCicdBaseUrl, getServiceKey, saveCredentials } from '../utils/auth';

/** Best-effort: open a URL in the user's default browser. */
function openBrowser(url: string): void {
  try {
    const platform = process.platform;
    if (platform === 'win32') {
      spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true }).unref();
    } else if (platform === 'darwin') {
      spawn('open', [url], { stdio: 'ignore', detached: true }).unref();
    } else {
      spawn('xdg-open', [url], { stdio: 'ignore', detached: true }).unref();
    }
  } catch {
    // Non-fatal — the URL is also printed for manual opening.
  }
}

export const loginCommand = new Command()
  .name('login')
  .description('Authenticate the Microfox CLI via the browser (device authorization)')
  .option('--mode <mode>', 'API mode (prod|staging)', 'prod')
  .option('--port <port>', 'Local cicd port (for local development)')
  .action(async (options: { mode?: string; port?: string }) => {
    const base = getCicdBaseUrl({
      mode: options.mode,
      port: options.port ? Number(options.port) : undefined,
    });
    const serviceKey = getServiceKey();

    try {
      const startRes = await axios.post(
        `${base}/api/auth/cli/start`,
        {},
        { headers: { 'x-microfox-service-key': serviceKey } }
      );
      const { deviceCode, userCode, verificationUrl, interval } = startRes.data as {
        deviceCode: string;
        userCode: string;
        verificationUrl: string;
        interval?: number;
      };

      console.log(chalk.cyan('\nTo authorize this CLI, open the following URL and sign in:\n'));
      console.log('  ' + chalk.bold(verificationUrl));
      console.log(chalk.gray(`\n  Verify this code matches your browser: ${chalk.bold(userCode)}\n`));
      openBrowser(verificationUrl);
      console.log(chalk.gray('Waiting for approval...'));

      const pollMs = Math.max(2, Number(interval) || 5) * 1000;
      const deadline = Date.now() + 10 * 60 * 1000;

      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, pollMs));
        const tokenRes = await axios.post(
          `${base}/api/auth/cli/token`,
          { deviceCode },
          { headers: { 'x-microfox-service-key': serviceKey }, validateStatus: () => true }
        );
        if (tokenRes.status === 200 && tokenRes.data?.token) {
          saveCredentials({
            token: tokenRes.data.token,
            userId: tokenRes.data.userId,
            cicdBase: base,
          });
          console.log(chalk.green('\n✅ Logged in. Credentials saved to ~/.microfox/credentials.json'));
          return;
        }
        if (tokenRes.status === 410) {
          console.error(
            chalk.red(`\n❌ Authorization ${tokenRes.data?.status || 'failed'}. Run \`microfox login\` again.`)
          );
          process.exit(1);
        }
        // 202 → still pending; keep polling.
      }
      console.error(chalk.red('\n❌ Login timed out. Run `microfox login` again.'));
      process.exit(1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(
          chalk.red(`\n❌ Login failed: ${err.response?.status ?? ''} ${JSON.stringify(err.response?.data ?? err.message)}`)
        );
      } else {
        console.error(chalk.red('\n❌ Login failed:'), err);
      }
      process.exit(1);
    }
  });
