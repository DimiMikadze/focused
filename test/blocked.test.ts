import puppeteer, { Browser, Page } from 'puppeteer';

import { EXTENSION_PATH, EXTENSION_URL, PUPPETEER_SLOW_MO } from './config/constants';
import { fillInputAndClick, clickOnToggleButton, delay } from './utils';

describe('Popup.', () => {
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
  });

  afterAll(async () => {
    await browser.close();
  });

  it('Should prevent/allow visiting a blocked/unblocked website before navigation.', async () => {
    const DOMAIN = 'google.com';
    const TITLE = 'Google';
    const BLOCKED_PAGE_TITLE = 'Blocked Website - Focused';
    await page.goto(`${EXTENSION_URL}/options.html`);

    await fillInputAndClick(page, DOMAIN);
    const page2 = await browser.newPage();
    await page2.goto(`https://${DOMAIN}`);
    await page2.waitForSelector('[data-blocked-url]');
    expect(await page2.title()).toEqual(BLOCKED_PAGE_TITLE);
    expect(await page2.$eval('[data-blocked-url]', (e: HTMLElement) => e.innerText)).toEqual(DOMAIN);
    await page2.close();

    await page.bringToFront();
    await page.waitForSelector('[data-template-list-item-delete-button]');
    const deleteButtons = await page.$$('[data-template-list-item-delete-button]');
    await deleteButtons[0].click();
    const page3 = await browser.newPage();
    await page3.goto(`https://${DOMAIN}`);
    expect(await page3.title()).toEqual(TITLE);
    await page3.close();
  });

  it('Should prevent/allow visiting a blocked/unblocked website before a tab activation.', async () => {
    const DOMAIN = 'google.com';
    const TITLE = 'Google';
    const BLOCKED_PAGE_TITLE = 'Blocked Website - Focused';
    await page.goto(`${EXTENSION_URL}/options.html`);

    const page2 = await browser.newPage();
    await page2.goto(`https://${DOMAIN}`);
    await page.bringToFront();
    await fillInputAndClick(page, DOMAIN);
    await delay(1000);
    await page2.bringToFront();
    await page2.waitForNavigation();
    expect(await page2.title()).toEqual(BLOCKED_PAGE_TITLE);
    expect(await page2.$eval('[data-blocked-url]', (e: HTMLElement) => e.innerText)).toEqual(DOMAIN);

    await page.bringToFront();
    await page.waitForSelector('[data-template-list-item-delete-button]');
    const deleteButtons = await page.$$('[data-template-list-item-delete-button]');
    await deleteButtons[0].click();
    await page2.bringToFront();
    await page2.waitForNavigation();
    expect(await page2.title()).toEqual(TITLE);
    await page2.close();
  });

  it('Should prevent/allow visiting a website based on the focus mode toggle from the options page.', async () => {
    const DOMAIN = 'google.com';
    const TITLE = 'Google';
    const BLOCKED_PAGE_TITLE = 'Blocked Website - Focused';
    await page.goto(`${EXTENSION_URL}/options.html`);

    expect(await page.evaluate(() => document.querySelector('[data-logo]').className)).toEqual('logo logo-on');

    await fillInputAndClick(page, DOMAIN);
    await clickOnToggleButton(page);
    const page2 = await browser.newPage();
    await page2.goto(`https://${DOMAIN}`);
    expect(await page2.title()).toEqual(TITLE);

    await page.bringToFront();
    await page.waitForSelector('[data-toggle]');
    await clickOnToggleButton(page);
    await page2.bringToFront();
    await page2.waitForNavigation();
    expect(await page2.title()).toEqual(BLOCKED_PAGE_TITLE);
    expect(await page2.$eval('[data-blocked-url]', (e: HTMLElement) => e.innerText)).toEqual(DOMAIN);
    await page2.close();
  });

  it('Should prevent/allow visiting a website based on the focus mode toggle from the popup.', async () => {
    const DOMAIN = 'google.com';
    const TITLE = 'Google';
    const BLOCKED_PAGE_TITLE = 'Blocked Website - Focused';
    const NOT_AVAILABLE_MESSAGE = 'Not available on this page';

    await page.goto(`${EXTENSION_URL}/options.html`);
    await fillInputAndClick(page, DOMAIN);
    await page.goto(`${EXTENSION_URL}/popup.html`);
    await page.waitForSelector('[data-siteinfo-messages]');
    expect(await page.$eval('[data-siteinfo-messages]', (e: HTMLSpanElement) => e.innerText)).toEqual(
      NOT_AVAILABLE_MESSAGE
    );

    await clickOnToggleButton(page);
    const page2 = await browser.newPage();
    await page2.goto(`https://${DOMAIN}`);
    expect(await page2.title()).toEqual(TITLE);

    await page.bringToFront();
    await page.waitForSelector('[data-toggle]');
    await clickOnToggleButton(page);
    await page2.bringToFront();
    await page2.waitForNavigation();
    expect(await page2.title()).toEqual(BLOCKED_PAGE_TITLE);
    expect(await page2.$eval('[data-blocked-url]', (e: HTMLElement) => e.innerText)).toEqual(DOMAIN);
    await page2.close();
  });
});
