# Testing Guide for Focused Extension

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
EXTENSION_ID=your_extension_id_here
```

**How to get your Extension ID:**

1. Build the extension: `yarn build`
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder
3. Copy the extension ID shown under your extension name
4. Paste it into the `.env` file

## Running Tests

### Unit Tests

Tests for utility functions in `src/app/utils/`:

```bash
yarn test:unit
```

### E2E Tests

Integration tests using Puppeteer to test the full extension:

```bash
yarn test:e2e
```

**Note:** E2E tests will open a Chrome browser window and run automatically. Make sure:

- You have built the extension (`yarn build`)
- Your `.env` file has the correct `EXTENSION_ID`
- Chrome is installed

### Run All Tests

```bash
yarn test
```

## Troubleshooting

### Tests Timeout

Increase the timeout in `test/config/jest.setup.ts`:

```javascript
jest.setTimeout(60000); // 60 seconds
```

### Extension Not Loading

1. Make sure you've built the extension: `yarn build`
2. Verify the extension ID in `.env` matches the loaded extension
3. Check that the extension is enabled in Chrome

### Puppeteer Issues

If Puppeteer fails to launch Chrome, try:

```bash
rm -rf node_modules yarn.lock
yarn install
```

## Manifest V3 Updates

The tests have been updated to work with Manifest V3:

- All Chrome APIs now use Promises (async/await)
- Service worker architecture instead of background pages
- Updated `chrome.browserAction` to `chrome.action`

All tests should pass with the new Manifest V3 implementation.
