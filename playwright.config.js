// @ts-check
const { defineConfig, devices }= require('@playwright/test') ;

  const path = require('path');
  

//console.log("CONFIG DIR:", __dirname);
//console.log("ENV PATH:", path.resolve(__dirname, '.env'));
require('dotenv').config({
  path: path.join(process.cwd(), '.env'),
  override: true,
  debug: true

});
  //console.log('ENV EMAIL:', process.env.LOGIN_EMAIL);
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  testMatch: [
    '**/*.spec.{js,ts}',
    '**/*.test.{js,ts}'
  ],
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 60000,
  expect: {
    // ✅ Timeout for each expect/assertion — default is 5000ms (5s)
    timeout: 10000, // 10 seconds
  },

  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
     baseURL: 'https://eventhub.rahulshettyacademy.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    actionTimeout: 15000,  // 15 seconds

    navigationTimeout: 30000,

    viewport:null,
    launchOptions:{ args:['--start-maximized']
      
    }
  },

  /* Configure projects for major browsers */
  projects: [

    //{name:'setup', testMatch:/auth\.setup\.(ts|js)$/},
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined

    }
  }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'],storageState:'playwright/.auth/user.json' },
    //   dependencies:['setup'] 
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

