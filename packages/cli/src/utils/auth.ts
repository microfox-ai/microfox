import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * SEC-2 / Plan A — CLI auth helpers.
 *
 * The static service key is a *coarse* gate (a CLI is distributed publicly, so a baked
 * key isn't truly secret). Real authorization is the per-user token minted by
 * `microfox login` + the ownership check on cicd. Override the key with MICROFOX_SERVICE_KEY.
 */
const DEFAULT_SERVICE_KEY = 'microfox-cli-public-v1';

export interface MicrofoxCredentials {
  token: string;
  userId?: string;
  /** cicd origin the token was minted against (used by logout/revoke). */
  cicdBase?: string;
  createdAt?: string;
}

function credentialsPath(): string {
  return path.join(os.homedir(), '.microfox', 'credentials.json');
}

export function getServiceKey(): string {
  return (process.env.MICROFOX_SERVICE_KEY || '').trim() || DEFAULT_SERVICE_KEY;
}

/** Read saved credentials, preferring the MICROFOX_TOKEN env override (for CI). */
export function getCredentials(): MicrofoxCredentials | null {
  const envToken = (process.env.MICROFOX_TOKEN || '').trim();
  if (envToken) return { token: envToken };
  try {
    const parsed = JSON.parse(fs.readFileSync(credentialsPath(), 'utf-8')) as MicrofoxCredentials;
    if (parsed?.token) return parsed;
  } catch {
    // no/invalid credentials file
  }
  return null;
}

export function saveCredentials(creds: MicrofoxCredentials): void {
  const file = credentialsPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ ...creds, createdAt: new Date().toISOString() }, null, 2), {
    mode: 0o600,
  });
  try {
    fs.chmodSync(file, 0o600);
  } catch {
    // chmod is a no-op / may fail on Windows; ignore.
  }
}

export function clearCredentials(): void {
  try {
    fs.unlinkSync(credentialsPath());
  } catch {
    // already gone
  }
}

/** Headers for authenticated cicd requests: service key + (when logged in) bearer token. */
export function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'x-microfox-service-key': getServiceKey() };
  const creds = getCredentials();
  if (creds?.token) headers['Authorization'] = `Bearer ${creds.token}`;
  return headers;
}

/** cicd origin (no trailing path) for the given mode/port. */
export function getCicdBaseUrl({ mode, port }: { mode?: string; port?: number }): string {
  const normalizedMode =
    mode?.toLowerCase() === 'prod' || mode?.toLowerCase() === 'production' ? 'prod' : 'staging';
  if (port) return `http://localhost:${port}`;
  return `https://${normalizedMode}-v2-cicd.microfox.app`;
}
