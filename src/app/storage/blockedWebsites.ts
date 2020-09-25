/**
 * Gets all the blocked sites from the storage.
 */
export function getBlockedWebSites(): Promise<[]> {
  return new Promise((resolve) => {
    return chrome.storage.sync.get(['websites'], (result) => {
      if (result.websites) {
        resolve(JSON.parse(result.websites));
      } else {
        resolve([]);
      }
    });
  });
}

/**
 * Adds the site to the blocked sites storage.
 */
export async function addToBlockedWebSites(website: string): Promise<void> {
  const websites: string[] = await getBlockedWebSites();
  websites.unshift(website);

  return new Promise((resolve) => {
    return chrome.storage.sync.set({ websites: JSON.stringify(websites) }, () => {
      resolve();
    });
  });
}

/**
 * Removes the site from the blocked sites storage.
 */
export async function removeFromBlockedWebSites(website: string): Promise<void> {
  const websites: string[] = await getBlockedWebSites();
  const filteredWebsites = websites.filter((w) => w !== website);

  return new Promise((resolve) => {
    return chrome.storage.sync.set({ websites: JSON.stringify(filteredWebsites) }, () => {
      resolve();
    });
  });
}
