import { isBlockedPage, getSiteNameFromURL, getDomainNameFromURL } from '../utils/index';
import { Storage } from '../storage/index';
import { Events } from '../constants/index';

/**
 * Checks if the site is blocked before navigating to it.
 * If yes, shows the blocked page instead.
 */
function checkBeforeNavigation(): void {
  chrome.webNavigation.onCompleted.addListener(async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id || !tab.url) {
        return false;
      }

      const siteName: string = getDomainNameFromURL(tab.url);
      const blockedSites: string[] = await Storage.getBlockedWebSites();
      const focusMode = await Storage.getFocusMode();

      if (focusMode && blockedSites.includes(siteName) && !isBlockedPage(tab.url)) {
        chrome.tabs.update(tab.id, { url: `blocked.html?site=${tab.url}` });
      }

      return false;
    });
  });
}

/**
 * Checks if the site has been blocked before activating its tab.
 * If yes, shows the blocked page instead.
 */
function checkBeforeTabActivation(): void {
  chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url || !tab.id) {
        return false;
      }

      const currentSiteName: string = getDomainNameFromURL(tab.url);
      const blockedSites: string[] = await Storage.getBlockedWebSites();
      const focusMode = await Storage.getFocusMode();

      if (blockedSites.includes(currentSiteName) && !isBlockedPage(tab.url) && focusMode) {
        chrome.tabs.update(tab.id, { url: `blocked.html?site=${tab.url}` });
      }

      return false;
    });
  });
}

/**
 * Listens to focus mode change and updates the current tab based on focus mode.
 */
function listensToFocusModeChange(): void {
  chrome.runtime.onMessage.addListener((request) => {
    if (request.event !== Events.FOCUS_MODE_CHANGED) {
      return;
    }

    const { mode, tabId, url } = request;
    if (mode) {
      chrome.tabs.update(tabId, { url: `blocked.html?site=${url}` });
    } else {
      chrome.tabs.update(tabId, { url: getSiteNameFromURL(url) });
    }

    const windows = chrome.extension.getViews({ type: 'popup' });
    if (windows.length) {
      windows[0].close();
    }
  });
}

/**
 * Opens the options page after the installation of the extension.
 */
function openOptionsPageOnInstall(): void {
  chrome.runtime.onInstalled.addListener((details) => {
    // Run only after installation and not while testing with puppeteer.
    if (details.reason === 'install' && navigator.userAgent !== 'PuppeteerAgent') {
      chrome.tabs.create({ url: 'options.html' });
    }
  });
}

openOptionsPageOnInstall();
checkBeforeNavigation();
checkBeforeTabActivation();
listensToFocusModeChange();
