// Configuración de ambientes para Playwright
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Fix para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface EnvironmentConfig {
  name: string;
  baseURL: string;
  timeout: number;
  retries: number;
  workers: number;
  headless: boolean;
  slowMo: number;
  video: string;
  screenshot: string;
  trace: string;
}

export interface TestConfig {
  environments: Record<string, EnvironmentConfig>;
  defaultEnvironment: string;
  browsers: Record<string, { enabled: boolean; args: string[] }>;
  testSettings: {
    waitForLoadState: string;
    defaultTimeout: number;
    actionTimeout: number;
    navigationTimeout: number;
    expectTimeout: number;
  };
  reporting: Record<string, any>;
  database: Record<string, { resetBetweenTests: boolean; seedData: boolean }>;
}

// Cargar configuración de ambientes
function loadEnvironmentConfig(): TestConfig {
  try {
    const configPath = path.join(__dirname, 'environments.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config;
  } catch (error) {
    console.error('Error loading environment config:', error);
    // Fallback configuration
    return {
      environments: {
        dev: {
          name: 'Development',
          baseURL: 'http://localhost:3000',
          timeout: 30000,
          retries: 1,
          workers: 4,
          headless: false,
          slowMo: 100,
          video: 'retain-on-failure',
          screenshot: 'only-on-failure',
          trace: 'on-first-retry'
        }
      },
      defaultEnvironment: 'dev',
      browsers: {
        chromium: { enabled: true, args: [] }
      },
      testSettings: {
        waitForLoadState: 'networkidle',
        defaultTimeout: 5000,
        actionTimeout: 30000,
        navigationTimeout: 30000,
        expectTimeout: 10000
      },
      reporting: {},
      database: {
        dev: { resetBetweenTests: true, seedData: true }
      }
    };
  }
}

const config = loadEnvironmentConfig();

// Obtener ambiente actual desde variable de entorno o usar default
export function getCurrentEnvironment(): string {
  return process.env.TEST_ENV || process.env.NODE_ENV || config.defaultEnvironment;
}

// Obtener configuración del ambiente actual
export function getEnvironmentConfig(env?: string): EnvironmentConfig {
  const environment = env || getCurrentEnvironment();
  const envConfig = config.environments[environment];
  
  if (!envConfig) {
    console.warn(`Environment '${environment}' not found, using default '${config.defaultEnvironment}'`);
    return config.environments[config.defaultEnvironment];
  }
  
  return envConfig;
}

// Obtener configuración completa
export function getFullConfig(): TestConfig {
  return config;
}

// Obtener URL base del ambiente actual
export function getBaseURL(env?: string): string {
  return getEnvironmentConfig(env).baseURL;
}

// Verificar si estamos en producción
export function isProduction(env?: string): boolean {
  const environment = env || getCurrentEnvironment();
  return environment === 'prod' || environment === 'production';
}

// Verificar si estamos en desarrollo
export function isDevelopment(env?: string): boolean {
  const environment = env || getCurrentEnvironment();
  return environment === 'dev' || environment === 'development' || environment === 'local';
}

// Obtener configuración de base de datos
export function getDatabaseConfig(env?: string) {
  const environment = env || getCurrentEnvironment();
  return config.database[environment] || config.database.dev;
}

// Obtener configuración de reporting
export function getReportingConfig() {
  return config.reporting;
}

// Helper para logs de ambiente
export function logEnvironmentInfo() {
  const env = getCurrentEnvironment();
  const envConfig = getEnvironmentConfig(env);
  
  console.log(`\n🌍 AMBIENTE DE TESTING: ${envConfig.name}`);
  console.log(`🔗 URL Base: ${envConfig.baseURL}`);
  console.log(`⏱️  Timeout: ${envConfig.timeout}ms`);
  console.log(`🔄 Reintentos: ${envConfig.retries}`);
  console.log(`👥 Workers: ${envConfig.workers}`);
  console.log(`👁️  Headless: ${envConfig.headless ? 'Sí' : 'No'}`);
  console.log(`==========================================\n`);
}

// Exportar configuraciones
export {
  config as EnvironmentSettings
};
