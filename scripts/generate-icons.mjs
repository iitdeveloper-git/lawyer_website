import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const source = readFileSync(fileURLToPath(new URL('../public/favicon.svg', import.meta.url)));
const output = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

function png(size) {
  return new Resvg(source, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

const small = png(32);
writeFileSync(output('favicon-32.png'), small);
writeFileSync(output('apple-touch-icon.png'), png(180));

// ICO files can contain a PNG image. This keeps the classic favicon sharp.
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(small.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(output('favicon.ico'), Buffer.concat([header, small]));
console.log('Generated PNG, ICO and Apple touch icons from favicon.svg.');
