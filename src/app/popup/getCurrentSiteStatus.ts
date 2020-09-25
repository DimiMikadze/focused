import { isBlockedPage, getSiteNameFromURL, getDomainNameFromURL, isValidUrl } from '../utils/index';
import { SiteStatus } from '../constants/index';

/**
 * Finds out whether the current site is available/unavailable for blocking or already blocked.
 */
export default async function getCurrentSiteStatus(): Promise<{
  siteStatus: SiteStatus;
  siteName: string;
  tabId: number;
  url: string;
}> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab.url || !tab.id) {
        return resolve({ siteStatus: SiteStatus.UNAVAILABLE_FOR_BLOCKING, siteName: '', tabId: 0, url: '' });
      }

      const domainName: string = getDomainNameFromURL(tab.url);

      if (isBlockedPage(tab.url)) {
        const siteUrl = getSiteNameFromURL(tab.url);
        const siteName = getDomainNameFromURL(siteUrl);
        return resolve({
          siteStatus: SiteStatus.ALREADY_BLOCKED,
          siteName: siteName || '',
          tabId: tab.id,
          url: tab.url,
        });
      }

      if (!isValidUrl(tab.url)) {
        return resolve({
          siteStatus: SiteStatus.UNAVAILABLE_FOR_BLOCKING,
          siteName: '',
          tabId: tab.id,
          url: tab.url,
        });
      }

      return resolve({
        siteStatus: SiteStatus.AVAILABLE_FOR_BLOCKING,
        siteName: domainName,
        tabId: tab.id,
        url: tab.url,
      });
    });
  });
}
