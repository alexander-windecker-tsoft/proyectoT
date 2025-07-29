import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig, getFullConfig, logEnvironmentInfo } from './tests/config/environment-config';

// Obtener configuración del ambiente actual
const envConfig = getEnvironmentConfig();
const fullConfig = getFullConfig();

// Log información del ambiente
logEnvironmentInfo();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry based on environment */
  retries: envConfig.retries,
  /* Workers based on environment */
  workers: envConfig.workers,
  /* Timeout based on environment */
  timeout: envConfig.timeout,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { 
      open: fullConfig.reporting.html?.open || 'never',
      outputFolder: 'playwright-report'
    }],
    ['json', { outputFile: fullConfig.reporting.json?.outputFile || 'test-results/results.json' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL from environment configuration */
    baseURL: envConfig.baseURL,

    /* Timeouts from environment configuration */
    actionTimeout: fullConfig.testSettings.actionTimeout,
    navigationTimeout: fullConfig.testSettings.navigationTimeout,

    /* Collect trace based on environment */
    trace: envConfig.trace as 'on' | 'off' | 'retain-on-failure' | 'on-first-retry',
    
    /* Video recording based on environment */
    video: envConfig.video as 'off' | 'on' | 'retain-on-failure' | 'on-first-retry',
    
    /* Screenshot on failure based on environment */
    screenshot: envConfig.screenshot as 'off' | 'on' | 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: envConfig.headless,
        launchOptions: {
          slowMo: envConfig.slowMo,
          args: fullConfig.browsers.chromium?.args || []
        }
      },
    },

    // Firefox y Webkit comentados por ahora para estabilidad
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     headless: envConfig.headless,
    //     launchOptions: {
    //       slowMo: envConfig.slowMo,
    //       args: fullConfig.browsers.firefox?.args || []
    //     }
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     headless: envConfig.headless,
    //     launchOptions: {
    //       slowMo: envConfig.slowMo,
    //       args: fullConfig.browsers.webkit?.args || []
    //     }
    //   },
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
  webServer: {
    command: 'npm run dev',
    url: envConfig.baseURL,
    reuseExistingServer: true,
  },
});
