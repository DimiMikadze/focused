import puppeteer, { Browser, Page } from 'puppeteer';

import { EXTENSION_PATH, EXTENSION_URL, PUPPETEER_SLOW_MO } from './config/constants';
import { clickOnToggleButton } from './utils';

describe('Popup.', () => {
  let page: Page, browser: Browser;

  afterAll(async () => {
    await browser.close();
  });

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        '--user-agent=PuppeteerAgent',
      ],
      slowMo: PUPPETEER_SLOW_MO,
    });

    page = await browser.newPage();
    await page.goto(`${EXTENSION_URL}/popup.html`);
  });

  it('Displays messages correctly, and the toggle button works.', async () => {
    const NOT_AVAILABLE_MESSAGE = 'Not available on this page';
    const MODE_OFF_MESSAGE = 'Focus mode is currently off';

    expect(await page.$eval('[data-siteinfo-messages]', (e: HTMLSpanElement) => e.innerText)).toEqual(
      NOT_AVAILABLE_MESSAGE
    );

    clickOnToggleButton(page);
    expect(await page.$eval('[data-siteinfo-messages]', (e: HTMLSpanElement) => e.innerText)).toEqual(MODE_OFF_MESSAGE);

    clickOnToggleButton(page);
    expect(await page.$eval('[data-siteinfo-messages]', (e: HTMLSpanElement) => e.innerText)).toEqual(
      NOT_AVAILABLE_MESSAGE
    );
  });
});
