require('dotenv').config();
const { chromium } = require('playwright');

(async () => {
  const url = process.env.URL;
  const password = process.env.PASSWORD;
  const forceLogin = process.env.FORCE_LOGIN === 'true';
  const headless = process.env.HEADLESS !== 'false';

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });
  console.log('Page loaded!');
  await page.fill('#pc-login-password', password);
  await page.click('#pc-login-btn');
  console.log('Login started!');

  // Wait for either alert or successful login indicator
  const hasloginDialog = await Promise.race([
    page.waitForSelector('#alert-container', { timeout: 10000 }).then(() => true),
    page.waitForSelector('li#advanced', { timeout: 10000 }).then(() => false),
  ]);

  if (hasloginDialog) {
    console.log('Previous login detected.');

    if (forceLogin) {
      console.log('Force login enabled, proceeding to force login.');
      await page.locator('#confirm-yes').click();
      console.log('Confirmed force login.');
    } else {
      console.log('Force login disabled, aborting.');
      await browser.close();
      return;
    }
  }
  console.log('Login successful!');

  await page.waitForSelector('li#advanced', {
    timeout: 10000,
  });
  
  await page.click('li#advanced');
  console.log('Navigated to the Advanced tab.');
  await page.waitForLoadState('networkidle');
  await page.click('#internet');
  console.log('Navigated to Network menu.');
  await page.click('a[url="advanceLte.htm"]');
  console.log('Navigated to mobile option.');
  await page.waitForLoadState('networkidle');

  const cover = page.locator('#a_mobileDataSwitch ul.button-group-cover');

  await cover.waitFor({ state: 'visible', timeout: 10000 });
  await cover.click();
  console.log('Click network toggle.');
  await page.waitForLoadState('networkidle');
  console.log('Network has been toggled.');

  // logout
  await page.click('#topLogout');
  await page
  .locator('#alert-container button.btn-msg-ok:has-text("Yes")')
  .click();
  console.log('Logging out...');
  await page.waitForLoadState('networkidle');
  await browser.close();
})();