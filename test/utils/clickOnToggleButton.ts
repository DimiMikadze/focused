import { Page } from 'puppeteer';

/**
 * Clicks on a toggle button that toggles the focus mode.
 */
export async function clickOnToggleButton(page: Page): Promise<void> {
  await page.evaluate(() => {
    const toggle: HTMLInputElement = document.querySelector('[data-toggle]');
    toggle.click();
  });

  return new Promise((resolve) => {
    resolve();
  });
}
