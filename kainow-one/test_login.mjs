// Simula login via sessionStorage e acessa a página admin como logado
// Vamos injetar o token diretamente e ver os erros JS
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const errors = [];
const warnings = [];

page.on('console', msg => {
  if (msg.type() === 'error') errors.push(`ERROR: ${msg.text()}`);
  if (msg.type() === 'warning') warnings.push(`WARN: ${msg.text()}`);
});
page.on('pageerror', err => errors.push(`PAGE_ERROR: ${err.message}\n${err.stack?.slice(0,300)}`));
page.on('requestfailed', req => errors.push(`REQ_FAIL: ${req.url()} — ${req.failure()?.errorText}`));

// 1) Vai para a página admin
await page.goto('https://b993d392.kainow-one.pages.dev/admin/', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);

// 2) Injeta sessionStorage para simular login
await page.evaluate(() => {
  sessionStorage.setItem('kainow_admin', 'true');
});

// 3) Recarrega a página (agora logado)
await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);

const bodySnippet = await page.evaluate(() => document.body.innerHTML.slice(0, 800));

console.log('=== ERRORS ===');
errors.forEach(e => console.log(e));
console.log('=== WARNINGS ===');
warnings.forEach(w => console.log(w));
console.log('=== BODY SNIPPET ===');
console.log(bodySnippet.slice(0, 400));

await browser.close();
