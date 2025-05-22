import { describe, it, expect } from 'vitest';
import { handleTask } from './index';
import fs from 'fs';

describe('Coding Agent', () => {
  it('should generate code for a given prompt', async () => {
    const path = await handleTask({ prompt: 'Test message' });

    const generated = fs.readFileSync(path, 'utf-8');
    expect(generated).toContain('console.log');
    expect(generated).toContain('Test message');
  });
});

