/**
 * Detects if User is on the Blocked Page.
 */
export function isBlockedPage(url: string): boolean {
  const extensionId = chrome.runtime.id;
  const blockedPage = 'blocked.html';

  return url.includes(extensionId) && url.includes(blockedPage);
}
