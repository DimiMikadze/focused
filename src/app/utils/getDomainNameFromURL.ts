/**
 * Get domain from URL.
 */
export function getDomainNameFromURL(value: string): string {
  return value.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
}
