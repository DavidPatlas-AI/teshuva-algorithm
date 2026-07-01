const { chromium } = require('playwright');
const path = require('path');

const EXT_PATH = path.resolve(__dirname, 'extension');
const SITE = process.argv[2] || 'https://www.youtube.com/results?search_query=football+highlights';

(async () => {
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${EXT_PATH}`,
      `--load-extension=${EXT_PATH}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--start-maximized'
    ],
    viewport: null
  });

  const page = await context.newPage();
  await page.goto(SITE, { waitUntil: 'domcontentloaded' });
  console.log('חלון Chrome נפתח עם התוסף טעון — קליפי אמור להופיע בפינה השמאלית-תחתונה.');
  console.log('החלון יישאר פתוח. סגור אותו ידנית כשתרצה, או Ctrl+C כאן כדי לסגור אותו.');

  // Keep the process (and the browser window) alive until manually stopped
  await new Promise(() => {});
})();
