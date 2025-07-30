import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig, getFullConfig, logEnvironmentInfo } from './tests/config/environment-config';

// Obtener configuración del ambiente actual
const envConfig = getEnvironmentConfig();
const fullConfig = getFullConfig();

// Log información del ambiente solo si no estamos en CI
if (!process.env.CI) {
  logEnvironmentInfo();
}

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
  
  /* Global test timeout */
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined, // 1 hora en CI
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [
    ['html', { 
      open: 'never',
      outputFolder: 'playwright-report'
    }],
    ['json', { 
      outputFile: fullConfig.reporting.json?.outputFile || 'test-results/results.json' 
    }],
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }],
    ['list'],
    ['github'] // Reporter específico para GitHub Actions
  ] : [
    ['html', { 
      open: (fullConfig.reporting.html && 'open' in fullConfig.reporting.html ? fullConfig.reporting.html.open : 'never'),
      outputFolder: 'playwright-report'
    }],
    ['json', { 
      outputFile: fullConfig.reporting.json?.outputFile || 'test-results/results.json' 
    }],
    ['list']
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

    /* Accept downloads */
    acceptDownloads: true,

    /* Ignore HTTPS errors para ambientes de desarrollo */
    ignoreHTTPSErrors: envConfig.environment !== 'prod',

    /* Configuración adicional para CI */
    ...(process.env.CI && {
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    }),
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.CI ? true : envConfig.headless,
        launchOptions: {
          slowMo: process.env.CI ? 0 : envConfig.slowMo,
          args: [
            ...(fullConfig.browsers.chromium?.args || []),
            // Argumentos adicionales para CI
            ...(process.env.CI ? [
              '--disable-dev-shm-usage',
              '--disable-blink-features=AutomationControlled',
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-gpu',
              '--disable-web-security',
              '--disable-features=IsolateOrigins',
              '--disable-site-isolation-trials'
            ] : [])
          ]
        }
      },
    },

    // Firefox - descomentarlo cuando necesites probarlo
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     headless: process.env.CI ? true : envConfig.headless,
    //     launchOptions: {
    //       slowMo: process.env.CI ? 0 : envConfig.slowMo,
    //       args: fullConfig.browsers.firefox?.args || []
    //     }
    //   },
    // },

    // Webkit - descomentarlo cuando necesites probarlo
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     headless: process.env.CI ? true : envConfig.headless,
    //     launchOptions: {
    //       slowMo: process.env.CI ? 0 : envConfig.slowMo,
    //       args: fullConfig.browsers.webkit?.args || []
    //     }
    //   },
    // },

    /* Test contra viewports móviles */
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     headless: process.env.CI ? true : envConfig.headless,
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 12'],
    //     headless: process.env.CI ? true : envConfig.headless,
    //   },
    // },
  ],

  /* Configuración del servidor para tests - FUNCIONA EN CI Y LOCAL */
  webServer: {
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // En CI siempre inicia nuevo servidor
    timeout: process.env.CI ? 180 * 1000 : 120 * 1000, // Más tiempo en CI
    // Esperar a que el servidor esté listo
    stdout: 'pipe',
    stderr: 'pipe',
    // En CI, configurar variables de entorno para el comando
    env: process.env.CI ? {
      PORT: '3000',
      HOST: '0.0.0.0'
    } : {}
  },

  /* Carpeta para outputs */
  outputDir: 'test-results/',

  /* Configuración para preservar outputs en CI */
  preserveOutput: 'failures-only',

  /* Configuración de grep para tags */
  grep: process.env.GREP ? new RegExp(process.env.GREP) : undefined,
  grepInvert: process.env.GREP_INVERT ? new RegExp(process.env.GREP_INVERT) : undefined,
});