import chromium from '@sparticuz/chromium';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Check if running locally
const isLocal = process.env.IS_OFFLINE || process.env.SERVERLESS_OFFLINE;

chromium.setGraphicsMode = false;

export const puppeteerLaunchProps = async (
  defaultViewport?: {
    width: number;
    height: number;
  },
  _isLocal?: boolean,
  headless?: boolean,
) => {
  let executablePath: string | undefined;

  console.log('isLocal', isLocal, process.env.CHROME_EXECUTABLE_PATH);
  const CHROME_PATHS = {
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      '~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '~/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '~/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome-beta',
      '/usr/bin/google-chrome-unstable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/microsoft-edge',
      '/usr/bin/microsoft-edge-stable',
      '/usr/bin/microsoft-edge-beta',
      '/usr/bin/microsoft-edge-dev',
      '/snap/bin/chromium',
      '/usr/local/bin/chrome',
      '/usr/local/bin/chromium',
      '/opt/google/chrome/chrome',
      '/opt/google/chrome-beta/chrome',
      '/opt/google/chrome-unstable/chrome',
      '/opt/chromium/chrome-linux/chrome',
      '/opt/microsoft/msedge/msedge',
      '/opt/brave.com/brave/brave',
      // Flatpak paths
      '~/.local/share/flatpak/exports/bin/org.chromium.Chromium',
      '/var/lib/flatpak/exports/bin/org.chromium.Chromium',
    ],
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Brave Software\\Brave-Browser\\Application\\brave.exe',
      'C:\\Program Files (x86)\\Brave Software\\Brave-Browser\\Application\\brave.exe',
      // User-specific locations with AppData
      `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      `${process.env.LOCALAPPDATA}\\Google\\Chrome SxS\\Application\\chrome.exe`,
      `${process.env.LOCALAPPDATA}\\Chromium\\Application\\chrome.exe`,
      `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
      `${process.env.LOCALAPPDATA}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
      // Windows 10/11 may have Edge installed in Program Files
      'C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge Beta\\Application\\msedge.exe',
      // Google Chrome default installation path
      `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
      `${process.env.ProgramFiles}\\Google\\Chrome Dev\\Application\\chrome.exe`,
      `${process.env.ProgramFiles}\\Google\\Chrome Beta\\Application\\chrome.exe`,
      `${process.env.ProgramFiles}\\Google\\Chrome SxS\\Application\\chrome.exe`,
      // Chromium
      `${process.env.ProgramFiles}\\Chromium\\Application\\chrome.exe`,
    ],
  };

  if (process.env.CHROME_EXECUTABLE_PATH) {
    executablePath = process.env.CHROME_EXECUTABLE_PATH;
  } else if (isLocal || _isLocal) {
    const platform = process.platform as keyof typeof CHROME_PATHS;
    const paths = CHROME_PATHS[platform];

    if (paths) {
      for (const p of paths) {
        if (fs.existsSync(p)) {
          executablePath = p;
          break;
        }
      }
    }

    if (platform === 'win32') {
      const tempPath = path.join(os.tmpdir(), 'sparticuz-chromium');
      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath, { recursive: true });
      }
    }

    if (!executablePath) {
      console.error(
        'Could not find Chrome in default locations. Please install Chrome or specify the path manually via the CHROME_EXECUTABLE_PATH environment variable.',
      );
      throw new Error('Chrome not found');
    }
  } else {
    // For Lambda environment
    executablePath = await chromium.executablePath();
  }

  const finalHeadless = isLocal || _isLocal ? (headless ?? false) : true;

  const tempDir = os.tmpdir();
  const userDataDir = fs.mkdtempSync(path.join(tempDir, 'puppeteer-'));

  const args = finalHeadless
    ? chromium.args
    : chromium.args.filter(arg => !arg.startsWith('--headless'));

  console.log('executablePath', executablePath, finalHeadless);

  return {
    args: [
      ...args,
      `--user-data-dir=${userDataDir}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ].concat(finalHeadless ? [] : [`--user-data-dir=${userDataDir}`]),
    defaultViewport: {
      width: defaultViewport?.width || 1920,
      height: defaultViewport?.height || 1080,
    },
    executablePath,
    headless: finalHeadless,
  };
};
