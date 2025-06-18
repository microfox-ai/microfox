import chromium from '@sparticuz/chromium';
import { execSync } from 'child_process';

// Check if running locally
const isLocal = process.env.IS_OFFLINE || process.env.SERVERLESS_OFFLINE;

chromium.setGraphicsMode = false;

export const puppeteerLaunchProps = async (defaultViewport?: {
  width: number;
  height: number;
}) => {
  let executablePath: string;

  if (isLocal) {
    // For local development, try to find Chrome in common locations
    try {
      if (process.platform === 'darwin') {
        // macOS
        executablePath =
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
      } else if (process.platform === 'linux') {
        // Linux
        executablePath = '/usr/bin/google-chrome';
      } else if (process.platform === 'win32') {
        // Windows
        executablePath =
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
      } else {
        throw new Error('Unsupported platform');
      }

      // Verify the path exists
      execSync(`test -f "${executablePath}"`);
    } catch (error) {
      console.error(
        'Could not find Chrome in default locations. Please install Chrome or specify the path manually.',
      );
      throw error;
    }
  } else {
    // For Lambda environment
    executablePath = await chromium.executablePath();
  }

  return {
    args: [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    defaultViewport: {
      width: defaultViewport?.width || 1920,
      height: defaultViewport?.height || 1080,
    },
    executablePath,
    headless: true,
  };
};
