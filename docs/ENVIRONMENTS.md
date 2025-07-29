# 🌍 Configuración de Ambientes - Playwright Tests

Esta documentación explica cómo usar y configurar diferentes ambientes para los tests de Playwright.

## 📁 Estructura de Archivos

``` h
tests/
├── config/
│   ├── environments.json       # ⚙️ Configuración de todos los ambientes
│   ├── environment-config.ts   # 🔧 Helpers y funciones de ambiente
│   ├── roles.json              # 👥 Configuración de roles
│   └── roles-config.ts         # 🔐 Helpers de roles
├── utils/
│   └── test-environment.ts     # 🛠️ Utilidades para tests
└── ...
```

## 🚀 Ambientes Disponibles

### 🔧 **Development (dev)**

- **URL**: `http://localhost:3000`
- **Uso**: Desarrollo local con debugging
- **Características**: Sin headless, timeouts cortos, más workers

### 🏗️ **Staging (staging)**

- **URL**: `https://staging-natacion.app.com`
- **Uso**: Tests de integración y pre-producción
- **Características**: Headless, timeouts medios, menos workers

### 🏭 **Production (prod)**

- **URL**: `https://natacion.app.com`
- **Uso**: Tests de smoke y validación final
- **Características**: Headless, timeouts largos, 1 worker, 3 reintentos

### 🏠 **Local (local)**

- **URL**: `http://127.0.0.1:3000`
- **Uso**: Testing local con máxima visibilidad
- **Características**: Todo habilitado (video, trace, screenshots)

## 📝 Comandos Disponibles

### ⚡ Comandos Rápidos

```bash
# Tests por ambiente
npm run test:dev        # Ambiente desarrollo
npm run test:staging    # Ambiente staging
npm run test:prod       # Ambiente producción
npm run test:local      # Ambiente local

# Tests específicos
npm run test:login      # Solo tests de login
npm run test:afiliados  # Solo tests de afiliados
npm run test:smoke      # Tests de smoke (@smoke)
npm run test:regression # Tests de regresión (@regression)

# Con UI
npm run test:dev:ui     # Ambiente dev con interfaz
npm run test:staging:headed # Staging con browser visible
```

### 🎯 Comandos Avanzados

```bash
# Ambiente específico con filtros
TEST_ENV=staging npx playwright test --grep "Login"
TEST_ENV=prod npx playwright test --grep "@smoke"

# Con browser específico
TEST_ENV=dev npx playwright test --project chromium

# Con debugging
TEST_ENV=local npx playwright test --debug
```

### 🪟 Script para Windows

```cmd
# Usar el script batch incluido
run-tests.bat dev
run-tests.bat staging login
run-tests.bat prod smoke
```

## ⚙️ Configuración Personalizada

### 🔧 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Ambiente por defecto
TEST_ENV=dev

# Override de URLs si es necesario
DEV_BASE_URL=http://localhost:3001
STAGING_BASE_URL=https://mi-staging.com

# Configuraciones de CI
CI=true
HEADLESS=true
```

### 📊 Modificar Configuración de Ambiente

Edita `tests/config/environments.json`:

```json
{
  "environments": {
    "mi_ambiente": {
      "name": "Mi Ambiente Custom",
      "baseURL": "https://mi-url.com",
      "timeout": 30000,
      "retries": 2,
      "workers": 3,
      "headless": true,
      "slowMo": 50,
      "video": "retain-on-failure",
      "screenshot": "only-on-failure",
      "trace": "on-first-retry"
    }
  }
}
```

## 🧪 Uso en Tests

### 🎯 Test Básico con Ambiente

```typescript
import { test, expect, TestEnvironment } from '../utils/test-environment';

test('Mi test que usa configuración de ambiente', async ({ page }) => {
  // El page ya está configurado con el ambiente actual
  await page.goto('/');
  
  // Verificar ambiente si es necesario
  if (TestEnvironment.isProd()) {
    // Comportamiento específico para producción
  }
});
```

### 🚫 Skips Condicionales

```typescript
test('Test solo para desarrollo', async ({ page }) => {
  TestEnvironment.skipInProduction(); // Se salta en prod
  
  // Test que solo corre en dev/staging
  await page.goto('/admin/debug');
});

test('Test solo para producción', async ({ page }) => {
  TestEnvironment.skipInDevelopment(); // Se salta en dev
  
  // Test que solo corre en prod
});
```

### 🏷️ Tags de Ambiente

```typescript
test('Test crítico @smoke @prod', async ({ page }) => {
  // Test que corre en smoke tests y ambiente prod
});

test('Test completo @regression @dev', async ({ page }) => {
  // Test que corre en regresión y ambiente dev
});
```

## 📈 Reportes por Ambiente

### 📊 Configuración de Reportes

Los reportes se configuran automáticamente según el ambiente:

- **HTML Report**: Siempre habilitado
- **JSON Report**: Para integración con CI/CD
- **JUnit Report**: Para Jenkins/Azure DevOps (configurable)

### 📁 Ubicación de Reportes

``` h
test-results/
├── html-report/     # Reporte HTML visual
├── results.json     # Datos JSON para CI/CD
└── videos/          # Videos de tests (según ambiente)
```

## 🔄 Integración CI/CD

### 🐙 GitHub Actions Ejemplo

```yaml
- name: Run Tests Development
  run: TEST_ENV=dev npm test
  
- name: Run Tests Staging  
  run: TEST_ENV=staging npm test
  
- name: Run Smoke Tests Production
  run: TEST_ENV=prod npm run test:smoke
```

### 🏗️ Pipeline Multi-Ambiente

```yaml
strategy:
  matrix:
    environment: [dev, staging, prod]
    
steps:
  - name: Run tests on ${{ matrix.environment }}
    run: TEST_ENV=${{ matrix.environment }} npm test
```

## 🚨 Troubleshooting

### ❌ Error: "Environment 'X' not found"

- Verifica que el ambiente esté definido en `environments.json`
- Revisa que `TEST_ENV` tenga el valor correcto

### ⏱️ Timeouts en Staging/Prod

- Los timeouts son más largos en estos ambientes
- Ajusta `timeout` en `environments.json` si es necesario

### 🔗 URL no accesible

- Verifica que `baseURL` sea correcta en `environments.json`
- Para URLs locales, asegúrate que el servidor esté corriendo

## 💡 Tips y Mejores Prácticas

1. **🎯 Usa ambientes específicos**: `dev` para desarrollo, `staging` para integración, `prod` para smoke tests
2. **🏷️ Aplica tags apropiados**: `@smoke`, `@regression`, `@dev`, `@prod`
3. **⏱️ Ajusta timeouts por ambiente**: Más largos para prod/staging
4. **🚫 Skip tests inteligentemente**: Algunos tests no deben correr en producción
5. **📊 Revisa reportes**: HTML para debugging, JSON para métricas

---

¿Necesitas ayuda? Revisa la documentación de [Playwright](https://playwright.dev/) o crea un issue en el repositorio.
