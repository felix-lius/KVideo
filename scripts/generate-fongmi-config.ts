import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { convertToFongMiConfig } from '../lib/server/fongmi-config';

const sourcePath = fileURLToPath(new URL('../video2.json', import.meta.url));
const outputPath = fileURLToPath(new URL('../fongmi.json', import.meta.url));
const sources: unknown = JSON.parse(readFileSync(sourcePath, 'utf8'));
const output = `${JSON.stringify(convertToFongMiConfig([sources]), null, 2)}\n`;

if (process.argv.includes('--check')) {
  try {
    if (readFileSync(outputPath, 'utf8') !== output) {
      throw new Error('fongmi.json is out of date; run npm run fongmi:generate');
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error('fongmi.json is missing; run npm run fongmi:generate');
    }
    throw error;
  }
} else {
  writeFileSync(outputPath, output);
}
