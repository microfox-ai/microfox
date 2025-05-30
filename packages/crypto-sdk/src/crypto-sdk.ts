import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export type EncryptionAlgorithm = 'aes-256-gcm' | 'aes-256-cbc' | 'aes-128-gcm' | 'aes-128-cbc';
export type HashAlgorithm = 'sha256' | 'sha512' | 'md5' | 'sha1';
export type KeyFormat = 'buffer' | 'base64' | 'hex' | 'utf8';
export type OutputEncoding = 'hex' | 'base64' | 'base64url' | 'utf8';

export interface CryptoVaultOptions {
  key: Buffer | string;
  keyFormat?: KeyFormat;
  encryptionAlgo: EncryptionAlgorithm;
  hashAlgo: HashAlgorithm;
  outputEncoding: OutputEncoding;
}

/**
 * CryptoVault - A versatile cryptography toolkit for various security operations
 */
export class CryptoVault {
  private key: Buffer;
  private encryptionAlgo: EncryptionAlgorithm;
  private hashAlgo: HashAlgorithm;
  private outputEncoding: OutputEncoding;

  constructor(options: CryptoVaultOptions) {
    // Set key
    if (typeof options.key === 'string') {
      this.key = Buffer.from(options.key, (options.keyFormat || 'base64') as BufferEncoding);
    } else {
      this.key = options.key;
    }

    // Set algorithms
    this.encryptionAlgo = options.encryptionAlgo;
    this.hashAlgo = options.hashAlgo;
    this.outputEncoding = options.outputEncoding;
  }

  /**
   * Create a new instance with different configuration
   */
  withConfig(options: Partial<CryptoVaultOptions>): CryptoVault {
    return new CryptoVault({
      key: options.key || this.key,
      keyFormat: options.keyFormat,
      encryptionAlgo: options.encryptionAlgo || this.encryptionAlgo,
      hashAlgo: options.hashAlgo || this.hashAlgo,
      outputEncoding: options.outputEncoding || this.outputEncoding
    });
  }

  /**
   * Decode and decrypt a single value to plain text
   */
  decrypt(encoded: string, encoding: OutputEncoding = 'base64url'): string {
    const data = encoding === 'base64url'
      ? this.decodeBase64Url(encoded)
      : Buffer.from(encoded, encoding as BufferEncoding);

    const decrypted = this.decryptData(data);
    return decrypted.toString('utf8');
  }

  /**
   * Encrypt and encode a plain text string
   */
  encrypt(plainText: string, encoding?: OutputEncoding): string {
    const data = Buffer.from(plainText, 'utf8');
    const encrypted = this.encryptData(data);

    const outputEncoding = encoding || this.outputEncoding;
    if (outputEncoding === 'base64url') {
      return this.encodeBase64Url(encrypted);
    } else {
      return encrypted.toString(outputEncoding as BufferEncoding);
    }
  }

  /**
   * Decode a URL-safe Base64 string to a Buffer
   */
  decodeBase64Url(input: string): Buffer {
    // replace URL-safe characters
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const mod4 = base64.length % 4;
    if (mod4 > 0) base64 += '='.repeat(4 - mod4);
    return Buffer.from(base64, 'base64');
  }

  /**
       * Encode a Buffer to a URL-safe Base64 string
       */
  encodeBase64Url(buffer: Buffer): string {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Decrypt data based on the configured algorithm
   */
  decryptData(buffer: Buffer): Buffer {
    if (this.encryptionAlgo.includes('gcm')) {
      // GCM mode: buffer = iv(12) | authTag(16) | ciphertext
      const iv = buffer.subarray(0, 12);
      const authTag = buffer.subarray(12, 28);
      const ciphertext = buffer.subarray(28);

      const decipher = crypto.createDecipheriv(this.encryptionAlgo, this.key, iv) as crypto.DecipherGCM;
      decipher.setAuthTag(authTag);

      return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    } else {
      // CBC mode: buffer = iv(16) | ciphertext
      const iv = buffer.subarray(0, 16);
      const ciphertext = buffer.subarray(16);

      const decipher = crypto.createDecipheriv(this.encryptionAlgo, this.key, iv);
      return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }
  }

  /**
   * Encrypt data based on the configured algorithm
   */
  encryptData(buffer: Buffer): Buffer {
    if (this.encryptionAlgo.includes('gcm')) {
      // GCM mode
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(this.encryptionAlgo, this.key, iv) as crypto.CipherGCM;

      const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final()]);
      const authTag = cipher.getAuthTag();

      return Buffer.concat([iv, authTag, ciphertext]);
    } else {
      // CBC mode
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.encryptionAlgo, this.key, iv);

      const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final()]);
      return Buffer.concat([iv, ciphertext]);
    }
  }

  /**
   * Generate a cryptographically secure key
   */
  static generateKey(length: 16 | 24 | 32 = 32, format: KeyFormat = 'buffer'): Buffer | string {
    const keyBuffer = crypto.randomBytes(length);
    if (format === 'buffer') return keyBuffer;
    return keyBuffer.toString(format as BufferEncoding);
  }

  /**
   * Create a hash of the input
   */
  hash(input: string | Buffer, algorithm?: HashAlgorithm, encoding?: OutputEncoding): string {
    const algo = algorithm || this.hashAlgo;
    const outputEncoding = encoding || this.outputEncoding;
    const data = typeof input === 'string' ? Buffer.from(input) : input;
    const hash = crypto.createHash(algo).update(data).digest();

    if (outputEncoding === 'base64url') {
      return this.encodeBase64Url(hash);
    }
    return hash.toString(outputEncoding as BufferEncoding);
  }

  /**
   * Create an HMAC signature
   */
  hmac(input: string | Buffer, secret?: string | Buffer, algorithm?: HashAlgorithm, encoding?: OutputEncoding): string {
    const algo = algorithm || this.hashAlgo;
    const outputEncoding = encoding || this.outputEncoding;
    const secretToUse = secret || this.key;
    const secretBuffer = typeof secretToUse === 'string' ? Buffer.from(secretToUse, 'utf8') : secretToUse;
    const data = typeof input === 'string' ? Buffer.from(input) : input;

    const hmac = crypto.createHmac(algo, secretBuffer).update(data).digest();

    if (outputEncoding === 'base64url') {
      return this.encodeBase64Url(hmac);
    }
    return hmac.toString(outputEncoding as BufferEncoding);
  }

  /**
   * Create a signed JWT token
   */
  createJWT(payload: object, expiresInSeconds: number = 3600, algorithm: 'HS256' | 'HS512' = 'HS256'): string {
    const header = { alg: algorithm, typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds
    };

    const base64Header = this.encodeBase64Url(Buffer.from(JSON.stringify(header)));
    const base64Payload = this.encodeBase64Url(Buffer.from(JSON.stringify(tokenPayload)));

    const hmacAlgo = algorithm === 'HS256' ? 'sha256' : 'sha512';
    const signature = this.hmac(
      `${base64Header}.${base64Payload}`,
      this.key,
      hmacAlgo as HashAlgorithm,
      'base64'
    );
    const base64Signature = this.encodeBase64Url(Buffer.from(signature, 'base64'));

    return `${base64Header}.${base64Payload}.${base64Signature}`;
  }

  /**
   * Verify and decode a JWT token
   */
  verifyJWT(token: string): object | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [base64Header, base64Payload, base64Signature] = parts;

    try {
      // Parse header to get algorithm
      const header = JSON.parse(Buffer.from(this.decodeBase64Url(base64Header || '')).toString('utf8'));
      const hmacAlgo = header.alg === 'HS256' ? 'sha256' : 'sha512';

      // Verify signature
      const expectedSignature = this.hmac(
        `${base64Header}.${base64Payload}`,
        this.key,
        hmacAlgo as HashAlgorithm,
        'base64'
      );
      const expectedBase64Signature = this.encodeBase64Url(Buffer.from(expectedSignature, 'base64'));

      if (base64Signature !== expectedBase64Signature) return null;

      // Decode payload
      const payload = JSON.parse(Buffer.from(this.decodeBase64Url(base64Payload || '')).toString('utf8'));

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) return null;

      return payload;
    } catch (e) {
      return null;
    }
  }

  /**
   * Generate a secure random string
   */
  generateRandomString(length: number = 32, encoding: BufferEncoding = 'hex'): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString(encoding).slice(0, length);
  }

  /**
   * Generate a password hash with salt
   */
  hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    return new Promise((resolve, reject) => {
      // Simple pbkdf2 implementation
      crypto.randomBytes(16, (err, salt) => {
        if (err) return reject(err);

        crypto.pbkdf2(password, salt, saltRounds * 1000, 64, this.hashAlgo, (err, derivedKey) => {
          if (err) return reject(err);
          resolve(`${salt.toString('hex')}:${derivedKey.toString('hex')}`);
        });
      });
    });
  }

  /**
   * Verify a password against a hash
   */
  verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [saltHex, hashHex] = hash.split(':');
      const salt = Buffer.from(saltHex || '', 'hex');

      crypto.pbkdf2(password, salt, 10 * 1000, 64, this.hashAlgo, (err, derivedKey) => {
        if (err) return reject(err);
        resolve(derivedKey.toString('hex') === hashHex);
      });
    });
  }
}
