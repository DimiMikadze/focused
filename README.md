<h1 align="center">
  <a href="https://chrome.google.com/webstore/detail/focused/nhmfobpmgblnndffibohjdlpjdcpmcel">Focused</a> &middot;
  
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" />

  <img src="https://img.shields.io/badge/PRs-welcome-green.svg" alt="PRs Welcome" />
</h1>

<p align="center">
  <kbd>
    <img width="320" src="https://res.cloudinary.com/dkkf9iqnd/image/upload/v1600957461/focused/popup.jpg">
  </kbd>
</p>

Focused is a Google Chrome extension that will improve your focus and increase productivity by blocking distracting websites while working or studying.

- **Simple to use:** Just add website domains to the blocked list once, and the extension will prevent you from visiting them. After work, you can turn off the focus mode and surf the internet without limitation.
- **Privacy Friendly:** A list of the blocked websites is being saved only in your Browser storage. Therefore only you have access to it.
- **Lightweight:** The final build of the extension is very lightweight and comes with zero dependencies.

## Installation

<a href="https://chrome.google.com/webstore/detail/focused/nhmfobpmgblnndffibohjdlpjdcpmcel">Click here</a> to install an extension from Chrome Web Store.

## Running local copy

- Clone the repository and install the dependencies with `yarn` or `npm install`.
- Create the initial bundle with `yarn build` or `npm run build`.
- Run the project in development mode by running `yarn start` or `npm start`.
- Navigate to the Chrome extensions page, and enable **Developer mode**.
- Click the **LOAD UNPACKED** button and select the extension's build folder.

## Running tests

E2E and Unit tests are built with Puppeteer and Jest, and they can be run by the following commands:

- `yarn test:e2e` or `npm run test:e2e`
- `yarn test:unit` or `npm run test:unit`

## Build for the Chrome Web Store

`yarn build` or `npm run build`

Builds the app for production to the build folder by minimizing and optimizing it for the best performance.

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a Pull Request to the project.

## License

Focused is [MIT licensed](./LICENSE).
