require('dotenv').config();
const { chromium } = require('playwright');
const logger = require('./logger'); 

(async () => {
  const url = process.env.URL;
  const password = process.env.PASSWORD;
  const forceLogin = process.env.FORCE_LOGIN === 'true';
  const headless = process.env.HEADLESS !== 'false';

  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    logger.info('Page loaded!');
    await page.fill('#pc-login-password', password);
    await page.click('#pc-login-btn');
    logger.info('Login started!');

    // Wait for either alert or successful login indicator
    const hasloginDialog = await Promise.race([
      page.waitForSelector('#alert-container', { timeout: 10000 }).then(() => true),
      page.waitForSelector('li#advanced', { timeout: 10000 }).then(() => false),
    ]);

    if (hasloginDialog) {
      logger.info('Previous login detected.');

      if (forceLogin) {
        logger.info('Force login enabled, proceeding to force login.');
        await page.locator('#confirm-yes').click();
        logger.info('Confirmed force login.');
      } else {
        logger.info('Force login disabled, aborting.');
        await browser.close();
        return;
      }
    }
    logger.info('Login successful!');

    await page.waitForSelector('li#advanced', {
      timeout: 10000,
    });
  
    await page.click('li#advanced');
    logger.info('Navigated to the Advanced tab.');
    await page.waitForLoadState('networkidle');
    await page.click('#internet');
    logger.info('Navigated to Network menu.');
    await page.click('a[url="advanceLte.htm"]');
    logger.info('Navigated to mobile option.');
    await page.waitForLoadState('networkidle');

    const cover = page.locator('#a_mobileDataSwitch ul.button-group-cover');

    await cover.waitFor({ state: 'visible', timeout: 10000 });
    await cover.click();
    logger.info('Clicking network toggle.');
    await page.waitForLoadState('networkidle');

    const selectedBtn = page.locator('#a_mobileDataSwitch button.button-group-button.selected');
    await selectedBtn.waitFor({ timeout: 10000 });

    const currentValue = await selectedBtn.getAttribute('value');

    logger.info(`Network has been toggled. Current status: ${currentValue}`);

    // logout
    await page.click('#topLogout');
    await page
    .locator('#alert-container button.btn-msg-ok:has-text("Yes")')
    .click();
    logger.info('Logging out...');
    await page.waitForLoadState('networkidle');
  } catch (error) {
    logger.error('An error occurred:', error);
  } finally {
    logger.info('Closing browser...');
    await browser.close();
  }
})();