import { chromium } from '/Users/paolo/stardust/semrush/marketfxdigital/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8799/verify';
const OUT = '/Users/paolo/stardust/semrush/marketfxdigital-eds/verify';

const results = [];
function log(name, msg) { results.push(`[${name}] ${msg}`); console.log(`[${name}] ${msg}`); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERR:', m.text()); });

// ---------- article-cards ----------
await page.goto(`${BASE}/article-cards.html`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__ready === true, { timeout: 5000 });
const acBlocks = await page.$$('.article-cards-wrapper');
const limitCount = await acBlocks[0].evaluate((el) => el.querySelectorAll('.ac-card').length);
const allCount = await acBlocks[1].evaluate((el) => el.querySelectorAll('.ac-card').length);
const failCount = await acBlocks[2].evaluate((el) => el.querySelectorAll('.ac-card').length);
const failEmpty = await acBlocks[2].evaluate((el) => el.textContent.trim() === '');
// verify no /services entry leaked, and sorted desc by checking first title
const allTitles = await acBlocks[1].evaluate((el) => [...el.querySelectorAll('.ac-title')].map((n) => n.textContent));
const hasServices = allTitles.some((t) => t.includes('not a blog post'));
const placeholders = await acBlocks[1].evaluate((el) => el.querySelectorAll('.ac-media--placeholder').length);
log('article-cards', `limit=3 -> ${limitCount} cards`);
log('article-cards', `no-limit -> ${allCount} cards (expect 4 /blog/ posts)`);
log('article-cards', `/services filtered out: ${!hasServices}`);
log('article-cards', `first (newest) card: "${allTitles[0]}"`);
log('article-cards', `gradient placeholders (no image): ${placeholders}`);
log('article-cards', `fetch-fail graceful: ${failCount} cards, empty=${failEmpty}`);
await page.screenshot({ path: `${OUT}/shot-article-cards.png`, fullPage: true });

// ---------- contact-form ----------
await page.goto(`${BASE}/contact-form.html`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__ready === true, { timeout: 5000 });
const fieldCount = await page.$$eval('.cf-field', (els) => els.length);
const hasSelect = await page.$('.cf-field select') !== null;
const utmCount = await page.$$eval('input[type=hidden][name^=utm_]', (els) => els.length);
const endpointFlag = await page.getAttribute('.cf-form', 'data-endpoint');
// submit empty -> validation should fire
await page.click('.cf-submit');
const errText = await page.$eval('.cf-error', (el) => el.textContent).catch(() => '');
const anyError = await page.$$eval('.cf-error', (els) => els.some((e) => e.textContent.trim().length));
const successHiddenAfterInvalid = await page.$eval('.cf-success', (el) => el.hidden);
log('contact-form', `fields rendered: ${fieldCount}, has <select>: ${hasSelect}, hidden UTM inputs: ${utmCount}`);
log('contact-form', `data-endpoint placeholder: ${endpointFlag}`);
log('contact-form', `required validation fired on empty submit: ${anyError} (e.g. "${errText}")`);
log('contact-form', `success still hidden after invalid submit: ${successHiddenAfterInvalid}`);
await page.screenshot({ path: `${OUT}/shot-contact-form-validation.png`, fullPage: true });
// fill required + submit -> success
await page.fill('#cf-name', 'Jane Doe');
await page.fill('#cf-email', 'jane@acme.com');
await page.click('.cf-submit');
const successShown = await page.$eval('.cf-success', (el) => !el.hidden);
const formHidden = await page.$eval('.cf-form', (el) => el.hidden);
const schedulerFlag = await page.getAttribute('.cf-success', 'data-scheduler');
const schedulerHref = await page.getAttribute('.cf-scheduler', 'href');
log('contact-form', `success state shown after valid submit: ${successShown}, form hidden: ${formHidden}`);
log('contact-form', `data-scheduler placeholder: ${schedulerFlag}, scheduler link href: ${schedulerHref}`);
await page.screenshot({ path: `${OUT}/shot-contact-form-success.png`, fullPage: true });

// ---------- resource-cards ----------
await page.goto(`${BASE}/resource-cards.html`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__ready === true, { timeout: 5000 });
const rcCount = await page.$$eval('.rc-card', (els) => els.length);
const rcAllContact = await page.$$eval('.rc-card', (els) => els.every((a) => a.getAttribute('href') === '/contact-us'));
log('resource-cards', `cards rendered: ${rcCount}, all link to /contact-us: ${rcAllContact}`);
await page.screenshot({ path: `${OUT}/shot-resource-cards.png`, fullPage: true });

// ---------- glossary ----------
await page.goto(`${BASE}/glossary.html`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__ready === true, { timeout: 5000 });
const terms = await page.$$eval('.gl-group dt', (els) => els.map((e) => e.textContent));
const groups = await page.$$eval('.gl-group', (els) => els.map((e) => e.id));
const navActive = await page.$$eval('.gl-nav a.gl-nav-link', (els) => els.map((e) => e.textContent));
const sorted = terms.every((t, i) => i === 0 || terms[i - 1].localeCompare(t, 'en', { sensitivity: 'base' }) <= 0);
log('glossary', `terms: ${terms.length}, alpha-sorted: ${sorted}`);
log('glossary', `letter groups: ${groups.join(',')}`);
log('glossary', `active nav letters: ${navActive.join(' ')}`);
await page.screenshot({ path: `${OUT}/shot-glossary.png`, fullPage: true });

await browser.close();
console.log('\n===== SUMMARY =====');
console.log(results.join('\n'));
