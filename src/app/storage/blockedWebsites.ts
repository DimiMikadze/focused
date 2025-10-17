/**
 * Gets all the blocked sites from the storage.
 */
export async function getBlockedWebSites(): Promise<string[]> {
  const result = await chrome.storage.sync.get(['websites']);
  if (result.websites) {
    return JSON.parse(result.websites);
  } else {
    return [];
  }
}

/**
 * Adds the site to the blocked sites storage.
 */
export async function addToBlockedWebSites(website: string): Promise<void> {
  const websites: string[] = await getBlockedWebSites();
  websites.unshift(website);
  await chrome.storage.sync.set({ websites: JSON.stringify(websites) });
}

/**
 * Removes the site from the blocked sites storage.
 */
export async function removeFromBlockedWebSites(website: string): Promise<void> {
  const websites: string[] = await getBlockedWebSites();
  const filteredWebsites = websites.filter((w) => w !== website);
  await chrome.storage.sync.set({ websites: JSON.stringify(filteredWebsites) });
}
