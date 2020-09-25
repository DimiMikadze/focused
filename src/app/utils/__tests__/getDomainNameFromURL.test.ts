import { getDomainNameFromURL } from '../getDomainNameFromURL';

describe('getDomainNameFromURL utility function', () => {
  it('Returns an empty string when given an empty string.', () => {
    const url = '';
    expect(getDomainNameFromURL(url)).toBe('');
  });

  it('Returns the domain name when HTTP protocol is given.', () => {
    const url = 'http://test.com';
    const result = 'test.com';
    expect(getDomainNameFromURL(url)).toBe(result);
  });

  it('Returns the domain name when HTTPS protocol is given.', () => {
    const url = 'https://test.com';
    const result = 'test.com';
    expect(getDomainNameFromURL(url)).toBe(result);
  });

  it('Returns the domain name when protocol and pathname is given.', () => {
    const url = 'https://test.com/path/pathname';
    const result = 'test.com';
    expect(getDomainNameFromURL(url)).toBe(result);
  });

  it('Returns the domain name when protocol and query string is given.', () => {
    const url = 'https://test.com/?page=1&search=a';
    const result = 'test.com';
    expect(getDomainNameFromURL(url)).toBe(result);
  });

  it('Returns the host name when query string contains special characters.', () => {
    const url = 'https://test.com/?page=1&search=!@$%^&$!()*@<,.0';
    const result = 'test.com';
    expect(getDomainNameFromURL(url)).toBe(result);
  });

  it('Returns the host name when protocol, path, and query string is given.', () => {
    const url = 'https://test.com/path/?page=1&search=a';
    const result = 'test.com';
    expect(getDomainNameFromURL(url)).toBe(result);
  });
});
