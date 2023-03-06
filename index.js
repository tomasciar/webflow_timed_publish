import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @script
 */
runAtSpecificTimeOfDay(10, 0, main);

function main() {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      userDataDir: './cache/'
    });

    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    await page.goto('https://webflow.com/dashboard', { waitUntil: 'networkidle2' });

    await page.type('[data-automation-id="username-input"]', process.env.WEBFLOW_USERNAME, {
      delay: 100
    });

    await page.type('[data-automation-id="password-input"]', process.env.WEBFLOW_PASSWORD, {
      delay: 100
    });

    await page.click('[data-automation-id="login-button"]', { delay: 100 });
    await delay(10000);

    await page.click(`[site-name="${process.env.WEBFLOW_WEBSITE_NAME}"]`, { delay: 100 });
    await delay(10000);

    await page.click('[data-automation-id="publish-menu-button"]', { delay: 100 });
    await page.click('[data-automation-id="publish-button"]', { delay: 100 });
  })();
}

/**
 * @function runAtSpecificTimeOfDay
 * @param {number} hour - The hour of the day to run the callback at
 * @param {number} minutes - The minutes of the hour to run the callback at
 * @param {() => void} callback - The callback to run at the specified time
 */
function runAtSpecificTimeOfDay(hour, minutes, callback) {
  const TWENTY_FOUR_HOURS = 86400000;
  const NOW = new Date();

  let eta_ms = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), hour, minutes, 0, 0).getTime() - NOW;
  if (eta_ms < 0) eta_ms += TWENTY_FOUR_HOURS;

  setTimeout(function () {
    callback();
    setInterval(callback, TWENTY_FOUR_HOURS);
  }, eta_ms);
}

/**
 * @function delay
 * @param {number} time - The time to delay in milliseconds
 */
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
