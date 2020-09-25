import puppeteer, { Browser, Page } from 'puppeteer';

import { EXTENSION_PATH, EXTENSION_URL, PUPPETEER_SLOW_MO } from './config/constants';
import { fillInputAndClick, delay, clickOnToggleButton } from './utils';

describe('Options page.', () => {
  let page: Page, browser: Browser;

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
    await page.goto(`${EXTENSION_URL}/options.html`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('Has the Focus mode initially turned on, and the toggle button toggles it.', async () => {
    expect(await page.evaluate(() => document.querySelector('[data-logo]').className)).toEqual('logo logo-on');

    await clickOnToggleButton(page);
    expect(await page.evaluate(() => document.querySelector('[data-logo]').className)).toEqual('logo logo-off');

    await clickOnToggleButton(page);
    expect(await page.evaluate(() => document.querySelector('[data-logo]').className)).toEqual('logo logo-on');
  });

  it("Should display an error message if a domain name isn't valid.", async () => {
    const DOMAIN = 'facebook.com';
    const INVALID_DOMAIN = 'facebook';
    const NOT_VALID =
      'Please enter a domain name using one of the following formats: example.com, www.example.com, or http://example.com.';
    const ALREADY_BLOCKED = 'facebook.com is already blocked.';

    await page.evaluate(() => {
      const button: HTMLButtonElement = document.querySelector('[data-submit]');
      button.click();
    });
    expect(await page.$eval('[data-notifications]', (e: HTMLParagraphElement) => e.innerText)).toEqual(NOT_VALID);

    await fillInputAndClick(page, INVALID_DOMAIN);
    expect(await page.$eval('[data-notifications]', (e: HTMLParagraphElement) => e.innerText)).toEqual(NOT_VALID);

    await fillInputAndClick(page, DOMAIN);
    await delay(1000);
    await fillInputAndClick(page, DOMAIN);
    expect(await page.$eval('[data-notifications]', (e: HTMLParagraphElement) => e.innerText)).toEqual(
      `${ALREADY_BLOCKED}`
    );
  });

  it('Should add and remove website domains from the blocked list using form.', async () => {
    const LIST_TITLE = 'Blocked Websites';
    const TEST_DOMAINS = ['facebook.com', 'instagram.com', '9gag.com'];
    for (let i = 0; i < TEST_DOMAINS.length; i++) {
      await fillInputAndClick(page, TEST_DOMAINS[i]);
    }

    await page.waitForSelector('[data-list-title]');
    expect(await page.$eval('[data-list-title]', (e: HTMLLIElement) => e.innerText)).toEqual(LIST_TITLE);
    const listItems = await page.$$('[data-template-list-item-title]');
    expect(listItems.length).toBe(3);
    for (let i = 0; i < listItems.length; i++) {
      expect(await page.evaluate((element) => element.textContent, listItems[i])).toEqual(TEST_DOMAINS.reverse()[i]);
    }

    const deleteButtons = await page.$$('[data-template-list-item-delete-button]');
    await deleteButtons[1].click();
    await delay(1000);
    const editedListItems = await page.$$('[data-template-list-item-title]');
    expect(editedListItems.length).toBe(2);
  });
});
