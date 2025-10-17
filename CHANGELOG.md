# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-10-17

### 🎉 Major Update: Manifest V3 Migration

This is a major release upgrading the extension from Manifest V2 to V3, making it compatible with modern Chrome versions and the Chrome Web Store requirements.

### Added

- ✅ Manifest V3 support
- ✅ Service worker architecture (replaces persistent background pages)
- ✅ Promise-based Chrome APIs (async/await throughout)
- ✅ Modern build system (Webpack 5, TypeScript 5)

### Changed

- **Breaking**: Migrated from Manifest V2 to V3
- Updated all Chrome APIs from callback-based to Promise-based
- Replaced `chrome.browserAction` with `chrome.action` API
- Replaced `chrome.extension.getViews()` with message-passing architecture
- Updated all dependencies to latest versions
- Improved TypeScript configuration

### Technical Details

- TypeScript: 3.9.2 → 5.2.0
- Webpack: 4.43.0 → 5.88.0
- Chrome Types: 0.0.110 → 0.0.254
- All Chrome storage APIs now use async/await
- Background script now runs as a service worker
- Better error handling and type safety

### Migration Notes

This version is fully compatible with the previous version's functionality. All your blocked websites and settings will be preserved. The extension works exactly the same way from a user perspective, but is now built on modern Chrome extension standards.

---

## [1.1.1] - Previous Release

Last version using Manifest V2 (deprecated).
