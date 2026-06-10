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
    await page.waitForSelector('#teshuva-widget', { timeout: 8000 });
    const svgVisible = await page.isVisible('#teshuva-mascot-wrap');
    console.log('  ✅ Mascot widget in DOM, SVG visible:', svgVisible);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step2-mascot.png') });
  } catch (e) {
    console.log('  ❌ Mascot not found:', e.message);
  }

  // --- Step 3: greeting bubble ---
  console.log('\n[Step 3] Waiting for greeting bubble...');
  try {
    await page.waitForFunction(
      () => { const b = document.querySelector('#teshuva-bubble'); return b && !b.classList.contains('hidden') && b.textContent.trim().length > 5; },
      { timeout: 5000 }
    );
    const text = await page.$eval('#teshuva-bubble', el => el.textContent.trim().replace('✕', '').trim());
    console.log('  ✅ Bubble:', text);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step3-greeting.png') });
  } catch (e) {
    console.log('  ⚠️  Greeting bubble not shown:', e.message);
  }

  // --- Step 4: wait for category detection (posts are immediately visible) ---
  console.log('\n[Step 4] Waiting for first category detection...');
  try {
    await page.waitForFunction(
      () => {
        const b = document.querySelector('#teshuva-bubble');
        return b && !b.classList.contains('hidden') && !!b.querySelector('.category-tag');
      },
      { timeout: 15000 }
    );
    const cat  = await page.$eval('.category-tag', el => el.textContent.trim());
    const expl = await page.$eval('#teshuva-bubble', el => el.textContent.replace('✕','').trim());
    console.log('  ✅ Category detected:', cat);
    console.log('  Explanation:', expl);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step4-category.png') });
  } catch (e) {
    console.log('  ⚠️  No category bubble yet. Checking allTime storage...');
    const allTime = await page.evaluate(() => {
      return new Promise(resolve => {
        if (typeof chrome !== 'undefined' && chrome.storage)
          chrome.storage.local.get('allTime', d => resolve(d.allTime || {}));
        else resolve({});
      });
    });
    console.log('  Storage allTime:', JSON.stringify(allTime));
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step4-no-category.png') });
  }

  // --- Step 5: click mascot → stats panel ---
  console.log('\n[Step 5] Clicking mascot for stats...');
  try {
    // Use JS click to bypass animation stability check
    await page.evaluate(() => document.querySelector('#teshuva-mascot-wrap').click());
    await page.waitForTimeout(700);

    const statsVisible = await page.evaluate(() => {
      const s = document.querySelector('#teshuva-stats');
      return s && !s.classList.contains('hidden');
    });
    console.log('  Stats panel visible:', statsVisible);

    if (statsVisible) {
      const statsText = await page.$eval('#teshuva-stats', el => el.textContent.trim());
      console.log('  Stats:', statsText.slice(0, 200));
    }
    await page.screenshot({ path: path.join(SHOTS_DIR, 'step5-stats.png') });
  } catch (e) {
    console.log('  ⚠️  Stats click failed:', e.message);
  }

  // --- Step 6: verify brain classified all 6 posts ---
  console.log('\n[Step 6] Checking brain classification totals...');
  const allTime = await page.evaluate(() => {
    return new Promise(resolve => {
      try {
        chrome.storage.local.get('allTime', d => resolve(d.allTime || {}));
      } catch { resolve({}); }
    });
  });
  console.log('  Classification totals:', JSON.stringify(allTime));
  const total = Object.values(allTime).reduce((a, b) => a + b, 0);
  console.log('  Total posts classified:', total);

  // --- Step 7: popup ---
  console.log('\n[Step 7] Opening extension popup...');
  try {
    const bgWorkers = context.serviceWorkers();
    const extId = bgWorkers.length > 0
      ? bgWorkers[0].url().match(/chrome-extension:\/\/([^/]+)/)?.[1] : null;

    if (extId) {
      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extId}/popup/popup.html`);
      await popupPage.waitForTimeout(1200);
      const statsHtml = await popupPage.$eval('#stats-container', el => el.textContent.trim());
      console.log('  Popup stats:', statsHtml.slice(0, 200));
      await popupPage.screenshot({ path: path.join(SHOTS_DIR, 'step7-popup.png') });
      console.log('  Screenshot: step7-popup.png');
    }
  } catch (e) {
    console.log('  ⚠️  Popup test:', e.message);
  }

  console.log('\n--- Done. Screenshots in:', SHOTS_DIR, '---');
  await context.close();
  server.close();
})();
