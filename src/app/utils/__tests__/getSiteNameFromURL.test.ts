import { getSiteNameFromURL } from '../getSiteNameFromURL';

describe('getSiteNameFromURL utility function', () => {
  it('Returns site name when HTTP protocol is given.', () => {
    const url = 'chrome-extension://gnkmpgclihpaahkiilgphmehoepjgepd/blocked.html?site=http://test.com/';
    expect(getSiteNameFromURL(url)).toBe('http://test.com/');
  });

  it('Returns site name when HTTPS protocol is given.', () => {
    const url = 'chrome-extension://gnkmpgclihpaahkiilgphmehoepjgepd/blocked.html?site=https://test.com/';
    expect(getSiteNameFromURL(url)).toBe('https://test.com/');
  });

  it('Returns site name when protocol and path is given.', () => {
    const url = 'chrome-extension://gnkmpgclihpaahkiilgphmehoepjgepd/blocked.html?site=https://test.com/path/';
    expect(getSiteNameFromURL(url)).toBe('https://test.com/path/');
  });

  it('Returns site name when protocol, path and pathname is given.', () => {
    const url = 'chrome-extension://gnkmpgclihpaahkiilgphmehoepjgepd/blocked.html?site=https://test.com/path/pathname/';
    expect(getSiteNameFromURL(url)).toBe('https://test.com/path/pathname/');
  });

  it('Returns site name when protocol and qurey string is given.', () => {
    const url =
      'chrome-extension://gnkmpgclihpaahkiilgphmehoepjgepd/blocked.html?site=https://test.com/?page=1&search=a';
    expect(getSiteNameFromURL(url)).toBe('https://test.com/?page=1&search=a');
  });

  it('Returns site name when protocol, path and qurey string is given.', () => {
    const url =
      'chrome-extension://gnkmpgclihpaahkiilgphmehoepjgepd/blocked.html?site=https://test.com/path/?page=1&search=a';
    expect(getSiteNameFromURL(url)).toBe('https://test.com/path/?page=1&search=a');
  });

  it('Returns site name when query string contains special characters.', () => {
    const url =
      'chrome-extension://gnkmpgclihpaahkiilgphmehoepjgepd/blocked.html?site=https://test.com/?page=1&search=!@$%^&$!()*@<,.0';
    expect(getSiteNameFromURL(url)).toBe('https://test.com/?page=1&search=!@$%^&$!()*@<,.0');
  });
});
