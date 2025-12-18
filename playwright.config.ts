import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright Test Configuration for GitHub API Testing
 *
 * Configured for sequential execution to prevent state collision
 * and respect GitHub API rate limits.
 */
export default defineConfig({
  testDir: './tests',

  // Sequential execution to avoid conflicts
  fullyParallel: false,

  // Fail build if test.only is left in code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Sequential execution: 1 worker
  workers: 1,

  // HTML reporter for test results
  reporter: process.env.CI ? 'dot' : [['list'], ['html', { open: 'never' }]],

  // Global timeout for each test
  timeout: 30000,

  use: {
    baseURL: 'https://api.github.com',

    extraHTTPHeaders: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },

    // Collect trace on first retry for debugging
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'GitHub API Tests',
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
