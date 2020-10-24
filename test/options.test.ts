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

    await page.waitForSelector('[data-blocked-websites-title]');
    expect(await page.$eval('[data-blocked-websites-title]', (e: HTMLLIElement) => e.innerText)).toEqual(LIST_TITLE);
    const listItems = await page.$$('[data-blocked-websites-name]');
    expect(listItems.length).toBe(3);
    for (let i = 0; i < listItems.length; i++) {
      expect(await page.evaluate((element) => element.textContent, listItems[i])).toEqual(TEST_DOMAINS.reverse()[i]);
    }

    const deleteButtons = await page.$$('[data-blocked-websites-button]');
    await deleteButtons[1].click();
    await delay(1000);
    const editedListItems = await page.$$('[data-blocked-websites-name]');
    expect(editedListItems.length).toBe(2);
  });

  it('Should show website suggestions on input click, and hide them on outside input click.', async () => {
    await page.evaluate(() => {
      const input: HTMLInputElement = document.querySelector('[data-input]');
      input.click();
    });

    await page.waitForSelector('[data-autocomplete-li]');
    const autocompleteList = await page.$$('[data-autocomplete-li]');
    expect(autocompleteList.length > 0).toBeTruthy();

    await page.evaluate(() => {
      const heading: HTMLDivElement = document.querySelector('[data-heading]');
      heading.click();
    });
    const updatedAutocompleteList = await page.$$('[data-autocomplete-li]');
    console.log('updatedListItems', updatedAutocompleteList.length);
    expect(updatedAutocompleteList.length > 0).toBeFalsy();
  });

  it('Should suggest websites correctly based on the input value.', async () => {
    const TEST_DOMAINS = ['google.com', 'gizmodo.com', 'gigaom.com'];
    await page.focus('[data-input]');
    await page.keyboard.type('g');

    const autocompleteList = await page.$$('[data-autocomplete-li]');
    expect(autocompleteList.length).toBe(3);
    for (let i = 0; i < autocompleteList.length; i++) {
      expect(await page.evaluate((element) => element.innerText, autocompleteList[i])).toEqual(TEST_DOMAINS[i]);
    }
    await page.evaluate(() => {
      const input: HTMLInputElement = document.querySelector('[data-input]');
      input.value = '';
      const heading: HTMLDivElement = document.querySelector('[data-heading]');
      heading.click();
    });
  });

  it('Should navigate through autocomplete via keyboard and website to blocked list on enter press.', async () => {
    await page.focus('[data-input]');
    await page.keyboard.type('i');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const autocompleteList = await page.$$('[data-autocomplete-li]');
    const blockedListItems = await page.$$('[data-blocked-websites-name]');
    expect(await page.evaluate((element) => element.textContent, blockedListItems[0])).toEqual('instagram.com');
    expect(autocompleteList.length > 0).toBeFalsy();
  });
});
