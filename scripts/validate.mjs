import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import pages from '../src/content/pages.json' with { type: 'json' };

const root = fileURLToPath(new URL('../dist/', import.meta.url));
assert.equal(Object.keys(pages).length, 15);
assert(pages['/'], 'Home route must exist at /');
const titles = new Set();
for (const path of Object.keys(pages)) {
  const file = join(root, path === '/' ? '' : path.slice(1), 'index.html');
  const html = readFileSync(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Duplicate or missing title: ${path}`);
  titles.add(title);
  assert(html.includes('<meta name="description"') && html.includes('<link rel="canonical"'), path);
  assert(html.includes('<meta property="og:image"') && html.includes('<meta name="twitter:image"'), path);
  assert(html.includes('id="root"') && html.includes('id="main"'), path);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(match[1]);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
    const target = join(root, match[1].split('?')[0].slice(1));
    assert(existsSync(target) || existsSync(join(target, 'index.html')), `${path}: missing ${match[1]}`);
  }
}
assert(existsSync(join(root, '404.html')));
assert(existsSync(join(root, 'sitemap.xml')) && existsSync(join(root, 'robots.txt')));
assert(readFileSync(join(root, 'insights/understanding-investigation-records/index.html'), 'utf8').includes('noindex,follow'));
assert(!readFileSync(join(root, 'sitemap.xml'), 'utf8').includes('understanding-investigation-records'));
assert(readFileSync(join(root, 'contact/index.html'), 'utf8').includes('Continue in WhatsApp'));
console.log(`Validated ${titles.size} React pages, links, metadata, sitemap and 404 page.`);
