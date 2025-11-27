import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:50300',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
