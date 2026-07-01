const { chromium } = require('playwright');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');

const EXT_PATH  = path.resolve(__dirname, 'extension');
const TEST_HTML = path.resolve(__dirname, 'test-page.html');
const SHOTS_DIR = path.resolve(__dirname, 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

// Minimal static server for the test page
function startServer(port = 7777) {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(TEST_HTML).pipe(res);
    });
    server.listen(port, () => resolve(server));
  });
}

(async () => {
  const server = await startServer();
  console.log('Local server started on http://localhost:7777');

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

  // --- Step 1: load the local test feed ---
  console.log('\n[Step 1] Loading local test feed...');
  await page.goto('http://localhost:7777', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SHOTS_DIR, 'step1-test-page.png') });
  console.log('  Screenshot: step1-test-page.png');

  // --- Step 2: mascot appears ---
  console.log('\n[Step 2] Waiting for mascot widget...');
  try {
    await page.waitForSelector('#tshuva-mascot-wrapper', { timeout: 8000 });
    const svgVisible = await page.isVisible('#tshuva-mascot-wrapper .tshuva-svg');
    console.log('  ✅ Mascot widget in DOM, SVG visible:', svgVisible);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step2-mascot.png') });
  } catch (e) {
    console.log('  ❌ Mascot not found:', e.message);
  }

  // --- Step 3: greeting bubble ---
  console.log('\n[Step 3] Waiting for greeting bubble...');
  try {
    await page.waitForFunction(
      () => { const b = document.querySelector('#tshuva-bubble'); return b && b.style.display !== 'none' && b.textContent.trim().length > 5; },
      { timeout: 8000 }
    );
    const text = await page.$eval('#tshuva-bubble', el => el.textContent.trim());
    console.log('  ✅ Bubble:', text);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step3-greeting.png') });
  } catch (e) {
    console.log('  ⚠️  Greeting bubble not shown:', e.message);
  }

  // --- Step 4: wait for category detection / explanation bubble ---
  console.log('\n[Step 4] Waiting for category explanation bubble...');
  try {
    await page.waitForFunction(
      () => {
        const b = document.querySelector('#tshuva-bubble');
        return b && b.style.display !== 'none' && b.textContent.trim().length > 5;
      },
      { timeout: 20000, polling: 500 }
    );
    const expl = await page.$eval('#tshuva-bubble', el => el.textContent.trim());
    console.log('  ✅ Bubble text after posts observed:', expl);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step4-category.png') });
  } catch (e) {
    console.log('  ⚠️  No explanation bubble yet:', e.message);
  }

  // --- Step 5: post badges injected on the feed ---
  console.log('\n[Step 5] Checking post badges...');
  try {
    await page.waitForSelector('[class*="tshuva-badge"], [id*="tshuva-badge"]', { timeout: 8000 });
    const badgeCount = await page.$$eval('[class*="tshuva-badge"]', els => els.length);
    console.log('  ✅ Badge elements found:', badgeCount);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step5-badges.png') });
  } catch (e) {
    console.log('  ⚠️  No badges found:', e.message);
  }

  // --- Step 6: verify brain classification totals in storage ---
  console.log('\n[Step 6] Checking brain classification totals...');
  const allTime = await page.evaluate(() => {
    return new Promise(resolve => {
      try {
        chrome.storage.local.get('teshuva_all_time_v1', d => resolve(d));
      } catch { resolve({}); }
    });
  });
  console.log('  Raw storage snapshot:', JSON.stringify(allTime).slice(0, 500));

  // --- Step 7: open extension popup ---
  console.log('\n[Step 7] Opening extension popup...');
  try {
    const bgWorkers = context.serviceWorkers();
    const extId = bgWorkers.length > 0
      ? bgWorkers[0].url().match(/chrome-extension:\/\/([^/]+)/)?.[1] : null;

    if (extId) {
      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extId}/popup/popup.html`);
      await popupPage.waitForTimeout(1500);
      const statsText = await popupPage.$eval('#stats-grid', el => el.textContent.trim());
      console.log('  ✅ Popup stats-grid:', statsText.slice(0, 200));
      await popupPage.screenshot({ path: path.join(SHOTS_DIR, 'step7-popup.png') });
      console.log('  Screenshot: step7-popup.png');
    } else {
      console.log('  ⚠️  No service worker found — background script may not have started.');
    }
  } catch (e) {
    console.log('  ⚠️  Popup test:', e.message);
  }

  console.log('\n--- Done. Screenshots in:', SHOTS_DIR, '---');
  await context.close();
  server.close();
})();
