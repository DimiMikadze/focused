import path from 'path';

/**
 * Chrome extension ID in development mode isn't the same for everyone.
 * If you don't know what your extension's ID is, navigate to its options page and grab it from the URL.
 */
const EXTENSION_ID = process.env.EXTENSION_ID;

/**
 * Base URL of the extension.
 */
export const EXTENSION_URL = `chrome-extension://${EXTENSION_ID}`;

/**
 * Path to the extensions build folder.
 */
export const EXTENSION_PATH = path.join(__dirname, '../../build');

/**
 * Slows down Puppeteer operations by the specified amount of milliseconds.
 * Useful so that you can see what is going on.
 */
export const PUPPETEER_SLOW_MO = 0;
