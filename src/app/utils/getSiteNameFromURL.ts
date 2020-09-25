/**
 * Gets the site name from the URL.
 */
export function getSiteNameFromURL(url: string): string {
  const siteName = url.split('site=')[1];

  return siteName;
}
