const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });
  
  await page.goto('https://3456-i42l87q3ck5lmmtqdsc2m-5c13a017.sandbox.novita.ai/admin/');
  await page.waitForTimeout(3000);
  
  // Fill in login
  await page.fill('input[type="email"]', 'admin@kainow.com');
  await page.fill('input[type="password"]', 'Admin@2026');
  await page.click('button[type="submit"]');
  
  // Wait for admin panel to load
  await page.waitForTimeout(8000);
  
  const title = await page.title();
  const url = page.url();
  const bodyText = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
  
  console.log('TITLE:', title);
  console.log('URL:', url);
  console.log('BODY:', bodyText);
  console.log('ERRORS:', JSON.stringify(errors, null, 2));
  
  await browser.close();
})().catch(console.error);
