import { getSiteNameFromURL, getDomainNameFromURL } from '../utils/index';
import { Storage } from '../storage/index';

import '../../styles/global.css';
import '../../styles/blocked.css';

/**
 * Shows the desired site if it has been removed from the blocked list or focus mode has been turned off.
 */
function checkIfUnblocked(): void {
  chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab.url || !tab.id) {
        return false;
      }

      const url = getSiteNameFromURL(tab.url);
      if (!url) {
        return false;
      }

      const focusMode = await Storage.getFocusMode();
      if (!focusMode) {
        chrome.tabs.update(tab.id, { url: url });
      }

      const siteName = getDomainNameFromURL(url) || '';
      const blockedSites: string[] = await Storage.getBlockedWebSites();
      const isBlocked = blockedSites.includes(siteName);
      if (!isBlocked) {
        chrome.tabs.update(tab.id, { url: url });
      }
    });
  });
}

/**
 * Renders the specific blocked site information in the blocked page.
 */
function renderDesiredSiteInfo(): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab.id || !tab.url) {
      return null;
    }

    const url = getSiteNameFromURL(tab.url);
    if (!url) {
      return null;
    }

    const blockedListButtons = document.querySelectorAll('[data-button]') as NodeList;
    blockedListButtons.forEach((button) => {
      button.addEventListener('click', () => chrome.tabs.create({ url: 'options.html' }));
    });

    const siteName = getDomainNameFromURL(url) || '';
    const blockedUrlEl = document.querySelector('[data-blocked-url]') as HTMLSpanElement;
    blockedUrlEl.innerHTML = siteName;
  });
}

checkIfUnblocked();
renderDesiredSiteInfo();
