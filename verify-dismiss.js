const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const EXT_PATH  = path.resolve(__dirname, 'extension');
const SHOTS_DIR = path.resolve(__dirname, 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

const SITE = process.argv[2];
const LABEL = process.argv[3] || 'site';

(async () => {
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${EXT_PATH}`,
      `--load-extension=${EXT_PATH}`,
      '--no-first-run',
      '--no-default-browser-check'
    ]
  });

  const page = await context.newPage();
  page.on('console', msg => console.log('  [page]', msg.text()));
  page.on('pageerror', err => console.log('  [pageerror]', err.message));

  console.log(`\n[${LABEL}] Loading:`, SITE);
  await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log(`[${LABEL}] Final URL:`, page.url());
  await page.waitForTimeout(4000);
  for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(1200); }
  await page.screenshot({ path: path.join(SHOTS_DIR, `dismiss-${LABEL}-1-feed.png`) });

  const badgeCount = await page.evaluate(() => document.querySelectorAll('.tshuva-badge').length);
  console.log(`[${LABEL}] Badges found:`, badgeCount);
  if (badgeCount === 0) {
    const debug = await page.evaluate(() => ({
      mascotPresent: !!document.getElementById('tshuva-mascot-wrapper'),
      selectorMatches: document.querySelectorAll(({
        'reddit.com':'[data-testid=\'post-content\'] h3, .Post h3',
        'threads.net':'div[dir=\'auto\'] span',
        'linkedin.com':'.feed-shared-update-v2__description span, .update-components-text span',
      })[location.hostname.replace('www.','')] || 'NONE').length,
      textSample: [...document.querySelectorAll('div[dir="auto"] span')].slice(0,3).map(e=>e.textContent.slice(0,40)),
    }));
    console.log(`[${LABEL}] Debug:`, JSON.stringify(debug));
    console.log(`[${LABEL}] No badges — cannot test dismiss.`);
    await context.close();
    return;
  }

  // Click the dismiss (✕) button on the first badge
  const dismissBtn = await page.$('.tshuva-badge .tshuva-badge-dismiss');
  const box = await dismissBtn.boundingBox();
  console.log(`[${LABEL}] Clicking dismiss button at`, box);
  await dismissBtn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOTS_DIR, `dismiss-${LABEL}-2-after-click.png`) });

  // Was a native platform menu opened by menuBtn.click()?
  const menuOpen = await page.evaluate(() =>
    !!document.querySelector('[role="menu"], [role="listbox"], [data-testid="post-overflow-menu"], .artdeco-dropdown__content')
  );
  console.log(`[${LABEL}] Native menu still open after dismiss attempt:`, menuOpen);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SHOTS_DIR, `dismiss-${LABEL}-3-final.png`) });

  console.log(`[${LABEL}] Done.`);
  await context.close();
})();
