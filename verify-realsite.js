const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const EXT_PATH  = path.resolve(__dirname, 'extension');
const SHOTS_DIR = path.resolve(__dirname, 'screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

const SITE = process.argv[2] || 'https://x.com/search?q=israel&f=live';

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

  console.log('\n[Step 1] Loading real site:', SITE);
  await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(SHOTS_DIR, 'real-step1-loaded.png') });

  console.log('\n[Step 2] Waiting for mascot widget...');
  try {
    await page.waitForSelector('#tshuva-mascot-wrapper', { timeout: 10000 });
    console.log('  ✅ Mascot injected into real page DOM');
    await page.screenshot({ path: path.join(SHOTS_DIR, 'real-step2-mascot.png') });
  } catch (e) {
    console.log('  ❌ Mascot NOT found on real site:', e.message);
  }

  console.log('\n[Step 3] Scrolling feed to trigger post detection...');
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(SHOTS_DIR, 'real-step3-scrolled.png') });

  console.log('\n[Step 4] Checking bubble text + badges after scroll...');
  const bubbleText = await page.evaluate(() => {
    const b = document.querySelector('#tshuva-bubble');
    return b ? { text: b.textContent.trim(), visible: b.style.display !== 'none' } : null;
  });
  console.log('  Bubble state:', JSON.stringify(bubbleText));

  const badgeCount = await page.evaluate(() =>
    document.querySelectorAll('[class*="tshuva-badge"], [id*="tshuva-badge"]').length
  );
  console.log('  Badge elements on page:', badgeCount);
  await page.screenshot({ path: path.join(SHOTS_DIR, 'real-step4-final.png') });

  console.log('\n[Step 5] Opening extension popup with collected data...');
  try {
    const bgWorkers = context.serviceWorkers();
    const extId = bgWorkers.length > 0
      ? bgWorkers[0].url().match(/chrome-extension:\/\/([^/]+)/)?.[1] : null;
    if (extId) {
      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extId}/popup/popup.html`);
      await popupPage.waitForTimeout(1500);
      const statsText = await popupPage.$eval('#stats-grid', el => el.textContent.replace(/\s+/g, ' ').trim());
      console.log('  ✅ Popup stats-grid:', statsText);
      await popupPage.screenshot({ path: path.join(SHOTS_DIR, 'real-step5-popup.png') });
    } else {
      console.log('  ⚠️  No service worker found.');
    }
  } catch (e) {
    console.log('  ⚠️  Popup check failed:', e.message);
  }

  console.log('\n--- Done. Screenshots in:', SHOTS_DIR, '---');
  await context.close();
})();
