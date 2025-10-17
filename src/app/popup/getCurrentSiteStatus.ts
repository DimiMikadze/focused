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
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (!tab.url || !tab.id) {
    return { siteStatus: SiteStatus.UNAVAILABLE_FOR_BLOCKING, siteName: '', tabId: 0, url: '' };
  }

  const domainName: string = getDomainNameFromURL(tab.url);

  if (isBlockedPage(tab.url)) {
    const siteUrl = getSiteNameFromURL(tab.url);
    const siteName = getDomainNameFromURL(siteUrl);
    return {
      siteStatus: SiteStatus.ALREADY_BLOCKED,
      siteName: siteName || '',
      tabId: tab.id,
      url: tab.url,
    };
  }

  if (!isValidUrl(tab.url)) {
    return {
      siteStatus: SiteStatus.UNAVAILABLE_FOR_BLOCKING,
      siteName: '',
      tabId: tab.id,
      url: tab.url,
    };
  }

  return {
    siteStatus: SiteStatus.AVAILABLE_FOR_BLOCKING,
    siteName: domainName,
    tabId: tab.id,
    url: tab.url,
  };
}
