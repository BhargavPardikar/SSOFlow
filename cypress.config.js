const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://bhargavpardikar.miniorange.in",
    chromeWebSecurity: false,
    experimentalOriginDependencies: true,
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
