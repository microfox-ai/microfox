# CryptoVault SDK

A versatile TypeScript cryptography toolkit for various security operations including encryption, hashing, JWT tokens, and password management.

## Features

- 🔐 **Symmetric Encryption**: AES-256-GCM, AES-256-CBC, AES-128-GCM, AES-128-CBC
- 🔑 **Key Management**: Secure key generation and format conversion
- 🏷️ **Hashing**: SHA256, SHA512, MD5, SHA1 with HMAC support
- 🎫 **JWT Tokens**: Create and verify JSON Web Tokens
- 🔒 **Password Security**: PBKDF2-based password hashing and verification
- 🎲 **Random Generation**: Cryptographically secure random strings
- 📦 **Multiple Encodings**: Base64, Base64URL, Hex, UTF-8 support

## Installation

```bash
npm install @microfox/crypto-sdk
```

## Quick Start

```typescript
import { CryptoVault } from '@your-org/crypto-sdk';

// Generate a secure key
const key = CryptoVault.generateKey(32, 'base64');

// Create a vault instance
const vault = new CryptoVault({
  key: key,
  encryptionAlgo: 'aes-256-gcm',
  hashAlgo: 'sha256',
  outputEncoding: 'base64url'
});

// Encrypt data
const encrypted = vault.encrypt('Hello, World!');
console.log('Encrypted:', encrypted);

// Decrypt data
const decrypted = vault.decrypt(encrypted);
console.log('Decrypted:', decrypted); // "Hello, World!"
```

## API Reference

### Constructor Options

```typescript
interface CryptoVaultOptions {
  key: Buffer | string;           // Encryption key
  keyFormat?: KeyFormat;          // Key format: 'buffer' | 'base64' | 'hex' | 'utf8'
  encryptionAlgo: EncryptionAlgorithm; // 'aes-256-gcm' | 'aes-256-cbc' | 'aes-128-gcm' | 'aes-128-cbc'
  hashAlgo: HashAlgorithm;        // 'sha256' | 'sha512' | 'md5' | 'sha1'
  outputEncoding: OutputEncoding; // 'hex' | 'base64' | 'base64url' | 'utf8'
}
```

### Core Methods

#### Encryption & Decryption

```typescript
// Encrypt plain text
vault.encrypt(plainText: string, encoding?: OutputEncoding): string

// Decrypt encrypted data
vault.decrypt(encoded: string, encoding?: OutputEncoding): string
```

**Example:**
```typescript
const vault = new CryptoVault({
  key: 'your-secret-key',
  keyFormat: 'utf8',
  encryptionAlgo: 'aes-256-gcm',
  hashAlgo: 'sha256',
  outputEncoding: 'base64url'
});

const encrypted = vault.encrypt('Sensitive data');
const decrypted = vault.decrypt(encrypted);
```

#### Hashing

```typescript
// Create hash
vault.hash(input: string | Buffer, algorithm?: HashAlgorithm, encoding?: OutputEncoding): string

// Create HMAC signature
vault.hmac(input: string | Buffer, secret?: string | Buffer, algorithm?: HashAlgorithm, encoding?: OutputEncoding): string
```

**Example:**
```typescript
// Simple hash
const hash = vault.hash('data to hash');

// HMAC with custom secret
const signature = vault.hmac('message', 'secret-key');
```

#### JWT Operations

```typescript
// Create JWT token
vault.createJWT(payload: object, expiresInSeconds?: number, algorithm?: 'HS256' | 'HS512'): string

// Verify JWT token
vault.verifyJWT(token: string): object | null
```

**Example:**
```typescript
// Create token
const token = vault.createJWT(
  { userId: 123, role: 'admin' },
  3600, // 1 hour
  'HS256'
);

// Verify token
const payload = vault.verifyJWT(token);
if (payload) {
  console.log('Valid token:', payload);
} else {
  console.log('Invalid or expired token');
}
```

#### Password Management

```typescript
// Hash password with salt
vault.hashPassword(password: string, saltRounds?: number): Promise<string>

// Verify password
vault.verifyPassword(password: string, hash: string): Promise<boolean>
```

**Example:**
```typescript
// Hash password
const hashedPassword = await vault.hashPassword('user-password', 12);

// Verify password
const isValid = await vault.verifyPassword('user-password', hashedPassword);
console.log('Password valid:', isValid);
```

### Utility Methods

#### Key Generation

```typescript
// Generate secure key
CryptoVault.generateKey(length?: 16 | 24 | 32, format?: KeyFormat): Buffer | string
```

**Example:**
```typescript
// Generate 256-bit key as base64
const key = CryptoVault.generateKey(32, 'base64');

// Generate 128-bit key as buffer
const keyBuffer = CryptoVault.generateKey(16, 'buffer');
```

#### Random String Generation

```typescript
// Generate random string
vault.generateRandomString(length?: number, encoding?: BufferEncoding): string
```

**Example:**
```typescript
// Generate 32-character hex string
const randomHex = vault.generateRandomString(32, 'hex');

// Generate 16-character base64 string
const randomB64 = vault.generateRandomString(16, 'base64');
```

#### Configuration

```typescript
// Create new instance with different config
vault.withConfig(options: Partial<CryptoVaultOptions>): CryptoVault
```

**Example:**
```typescript
// Create variant with different algorithm
const gcmVault = vault.withConfig({
  encryptionAlgo: 'aes-256-gcm',
  outputEncoding: 'hex'
});
```

## Advanced Usage

### Multiple Configurations

```typescript
// Base configuration
const baseVault = new CryptoVault({
  key: CryptoVault.generateKey(32),
  encryptionAlgo: 'aes-256-gcm',
  hashAlgo: 'sha256',
  outputEncoding: 'base64url'
});

// Specialized configurations
const jwtVault = baseVault.withConfig({ hashAlgo: 'sha512' });
const fileVault = baseVault.withConfig({ 
  encryptionAlgo: 'aes-256-cbc',
  outputEncoding: 'hex' 
});
```

### Environment-based Configuration

```typescript
import dotenv from 'dotenv';
dotenv.config();

const vault = new CryptoVault({
  key: process.env.CRYPTO_KEY || CryptoVault.generateKey(32, 'base64'),
  encryptionAlgo: 'aes-256-gcm',
  hashAlgo: 'sha256',
  outputEncoding: 'base64url'
});
```

### Error Handling

```typescript
try {
  const decrypted = vault.decrypt(encryptedData);
  console.log('Success:', decrypted);
} catch (error) {
  console.error('Decryption failed:', error.message);
}

// JWT verification returns null for invalid tokens
const payload = vault.verifyJWT(token);
if (!payload) {
  throw new Error('Invalid or expired token');
}
```

## Security Best Practices

1. **Key Management**: Store keys securely using environment variables or key management services
2. **Algorithm Selection**: Use AES-256-GCM for authenticated encryption
3. **Random Generation**: Always use the built-in secure random generators
4. **JWT Expiration**: Set appropriate expiration times for tokens
5. **Password Hashing**: Use sufficient salt rounds (10-12) for password hashing

## Algorithm Support

### Encryption Algorithms
- `aes-256-gcm` - AES 256-bit with Galois/Counter Mode (recommended)
- `aes-256-cbc` - AES 256-bit with Cipher Block Chaining
- `aes-128-gcm` - AES 128-bit with Galois/Counter Mode
- `aes-128-cbc` - AES 128-bit with Cipher Block Chaining

### Hash Algorithms
- `sha256` - SHA-256 (recommended)
- `sha512` - SHA-512
- `sha1` - SHA-1 (legacy)
- `md5` - MD5 (legacy)

### Output Encodings
- `base64url` - URL-safe Base64 (recommended for web)
- `base64` - Standard Base64
- `hex` - Hexadecimal
- `utf8` - UTF-8 string

## TypeScript Support

This package is written in TypeScript and includes full type definitions:

```typescript
import { CryptoVault, EncryptionAlgorithm, HashAlgorithm } from '@your-org/crypto-sdk';

const algorithm: EncryptionAlgorithm = 'aes-256-gcm';
const hashAlgo: HashAlgorithm = 'sha256';
```

