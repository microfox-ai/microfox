// utils/logger.ts
// Simple logger utility to print messages with timestamp.

export function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}
