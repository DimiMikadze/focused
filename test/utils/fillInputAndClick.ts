import { Page } from 'puppeteer';

/**
 * Adds domain to the blocked list from the options page by
 * filling the input field and clicking on a submit button
 */
export async function fillInputAndClick(page: Page, input: string): Promise<void> {
  await page.evaluate((value) => {
    const input: HTMLInputElement = document.querySelector('[data-input]');
    const button: HTMLButtonElement = document.querySelector('[data-submit]');
    input.value = value;
    button.click();
  }, input);

  return new Promise((resolve) => {
    resolve();
  });
}
