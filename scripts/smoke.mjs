import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import pages from '../src/content/pages.json' with { type: 'json' };

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const base = 'http://127.0.0.1:4173';
const chrome = process.env.CHROME_PATH || (process.platform === 'win32'
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : '/usr/bin/google-chrome');
const vite = join(projectRoot, 'node_modules/vite/bin/vite.js');
const server = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { cwd: projectRoot, stdio: 'ignore' });
let browser;

async function ready() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(base)).ok) return; } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Vite preview did not start');
}

try {
  await ready();
  browser = await chromium.launch({ executablePath: chrome, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

  await page.goto(base + '/');
  await page.locator('#ack-accept').click();
  assert(await page.locator('.ack').isHidden(), 'Visitor acknowledgement did not close');
  assert.equal(await page.evaluate(() => localStorage.getItem('rkp_ack_v1')), 'yes');
  assert.equal(await page.locator('link[rel="icon"]').count(), 2);
  assert.equal(await page.locator('link[rel="apple-touch-icon"]').count(), 1);

  for (const asset of ['/favicon.svg', '/favicon-32.png', '/favicon.ico', '/apple-touch-icon.png', '/placeholder-chambers.webp', '/placeholder-research.webp']) {
    assert.equal((await page.request.get(base + asset)).status(), 200, `Missing asset: ${asset}`);
  }

  for (const route of Object.keys(pages)) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    assert(await page.locator('main h1').count(), `Missing heading: ${route}`);
    const links = await page.locator('a[href]').evaluateAll((elements) => elements.map((item) => item.getAttribute('href')));
    assert(!links.some((href) => href === '#' || href?.startsWith('javascript:')), `Inactive link: ${route}`);
    for (const href of [...new Set(links.filter((value) => value?.startsWith('/')))]) {
      assert.equal((await page.request.get(base + href)).status(), 200, `Broken ${route} -> ${href}`);
    }
  }

  await page.goto(base + '/');
  assert(await page.locator('.hero-photo img').evaluate((image) => image.complete && image.naturalWidth > 0), 'Home image did not load');
  await page.goto(base + '/about/');
  await page.locator('.editorial-photo-grid img').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const image = document.querySelector('.editorial-photo-grid img');
    return image?.complete && image.naturalWidth > 0;
  });
  assert.equal(await page.locator('a[href="https://iitdeveloper.com/"]').count(), 1);
  assert.equal(await page.locator('.float-whatsapp[href="https://wa.me/919414432758"]').count(), 1);

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/about/', '/contact/']) {
    await page.goto(base + route);
    const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    assert(width.scroll <= width.viewport + 1, `Horizontal overflow on ${route}: ${JSON.stringify(width)}`);
  }
  await page.goto(base + '/');
  const menu = page.locator('.menu-toggle');
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.locator('#site-nav a[href="/about/"]').click();
  await page.waitForURL(base + '/about/');
  assert.equal(await page.locator('main h1').count(), 1);

  await page.goto(base + '/contact/');
  const form = page.locator('#contact-form');
  await form.locator('button[type="submit"]').click();
  assert.equal(new URL(page.url()).pathname, '/contact/', 'Empty contact form submitted');
  await form.locator('[name="name"]').fill('Test Visitor');
  await form.locator('[name="phone"]').fill('9876543210');
  await form.locator('[name="email"]').fill('test@example.com');
  await form.locator('[name="category"]').selectOption({ label: 'Criminal law' });
  await form.locator('[name="message"]').fill('Please contact me about an appointment.');
  await form.locator('[name="consent"]').check();
  await page.route('https://wa.me/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: 'WhatsApp handoff test' }));
  await form.locator('button[type="submit"]').click();
  await page.waitForURL(/wa\.me\/919414432758/);
  const message = new URL(page.url()).searchParams.get('text');
  assert(message?.includes('Test Visitor') && message?.includes('Criminal law'), 'WhatsApp message missing form details');
  assert.deepEqual(errors, [], `Browser errors: ${errors.join('; ')}`);
  console.log(`Browser smoke test passed: ${Object.keys(pages).length} pages, internal links, images, favicon, mobile menu and WhatsApp form.`);
} finally {
  await browser?.close();
  server.kill();
}
