import { isValidUrl } from '../isValidUrl';

describe('Chek isValidUrl utility function on valid URLs', () => {
  it('Returns false when given an empty string.', () => {
    const url = '';
    expect(isValidUrl(url)).toBe(false);
  });

  it('Returns true when host name is given.', () => {
    const url = 'test.com';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when HTTP protocol is given.', () => {
    const url = 'http://test.com';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when HTTPS protocol is given.', () => {
    const url = 'https://test.com';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when HTTP protocol and WWW is given.', () => {
    const url = 'http://www.test.com';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when HTTPS protocol and WWW is given.', () => {
    const url = 'https://www.test.com';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when WWW is given.', () => {
    const url = 'www.test.com';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when protocol and pathname is given.', () => {
    const url = 'https://test.com/path/pathname';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when protocol, pathname and WWW is given.', () => {
    const url = 'https://www.test.com/path/pathname';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when protocol, WWW and query string is given.', () => {
    const url = 'https://www.test.com/?page=1&search=a';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns the true when query string contains WWW and special characters.', () => {
    const url = 'https://www.test.com/?page=1&search=!@$%^&$!()*@<,.0';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns true when protocol and query string is given.', () => {
    const url = 'https://test.com/?page=1&search=a';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns the true when query string contains special characters.', () => {
    const url = 'https://test.com/?page=1&search=!@$%^&$!()*@<,.0';
    expect(isValidUrl(url)).toBe(true);
  });

  it('Returns the true when protocol, path, and query string is given.', () => {
    const url = 'https://test.com/path/?page=1&search=a';
    expect(isValidUrl(url)).toBe(true);
  });
});
