import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const generatedComponentTypeFiles = [
  resolve('.nuxt/components.d.ts'),
  resolve('.nuxt/types/components.d.ts'),
];

for (const filePath of generatedComponentTypeFiles) {
  if (!existsSync(filePath)) continue;

  const source = readFileSync(filePath, 'utf8');
  const patched = source
    .split('\n')
    .filter((line) => !line.includes('NuxtPicture'))
    .join('\n');

  if (patched !== source) {
    writeFileSync(filePath, patched);
  }
}
