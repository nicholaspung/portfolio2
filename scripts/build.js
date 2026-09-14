import { cp, mkdir, rm } from 'node:fs/promises';

const source = new URL('../site/', import.meta.url);
const output = new URL('../public/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log('Copied site/ to public/. Ready for static hosting.');
