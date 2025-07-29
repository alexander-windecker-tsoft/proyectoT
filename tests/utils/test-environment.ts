// Helper para usar configuraciones de ambiente en tests
import { test as baseTest } from '@playwright/test';
import { getEnvironmentConfig, getCurrentEnvironment, isDevelopment, isProduction } from '../config/environment-config';

// Extender el test base con configuración de ambiente
export const test = baseTest.extend({
  // Configurar página con settings del ambiente
  page: async ({ page }, use) => {
    const envConfig = getEnvironmentConfig();
    
    // Configurar timeouts específicos del ambiente
    page.setDefaultTimeout(envConfig.timeout);
    page.setDefaultNavigationTimeout(envConfig.timeout);
    
    // Configurar wait for load state por defecto
    await page.goto('/', { waitUntil: 'networkidle' });
    
    await use(page);
  },
});

// Helper functions para tests
export const TestEnvironment = {
  // Obtener configuración actual
  getCurrentConfig: () => getEnvironmentConfig(),
  
  // Verificar ambiente
  isDev: () => isDevelopment(),
  isStaging: () => getCurrentEnvironment() === 'staging',
  isProd: () => isProduction(),
  isLocal: () => getCurrentEnvironment() === 'local',
  
  // Skips condicionales
  skipInProduction: () => {
    if (isProduction()) {
      test.skip(true, 'Test skipped in production environment');
    }
  },
  
  skipInDevelopment: () => {
    if (isDevelopment()) {
      test.skip(true, 'Test skipped in development environment');
    }
  },
  
  skipUnless: (condition: boolean, reason: string) => {
    if (!condition) {
      test.skip(true, reason);
    }
  },
  
  // Timeouts condicionales
  getTestTimeout: () => {
    const env = getCurrentEnvironment();
    switch (env) {
      case 'prod': return 60000;
      case 'staging': return 45000;
      case 'dev': return 30000;
      default: return 20000;
    }
  },
  
  // Configuración de retries
  getRetries: () => {
    const env = getCurrentEnvironment();
    switch (env) {
      case 'prod': return 3;
      case 'staging': return 2;
      case 'dev': return 1;
      default: return 0;
    }
  },
  
  // Tags del ambiente
  getEnvironmentTags: () => {
    const env = getCurrentEnvironment();
    return {
      smoke: ['@smoke'],
      regression: ['@regression'],
      environment: [`@${env}`],
      all: ['@smoke', '@regression', `@${env}`]
    };
  }
};

// Re-exportar expect para consistencia
export { expect } from '@playwright/test';
