import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3115",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx next dev --port 3115",
    url: "http://127.0.0.1:3115",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "msedge" },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"], channel: "msedge" },
    },
  ],
});
