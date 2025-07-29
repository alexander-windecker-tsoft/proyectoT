# 🔄 Sistema de Tests de Regresión - Guía Completa

## 📋 ¿Qué es el Test de Regresión?

El **test de regresión** en nuestro CI/CD verifica que **TODOS los tests** pasen después de cambios en el código, asegurando que las funcionalidades existentes no se rompan.

## 🎯 Diferencias entre tipos de tests

| Tipo de Test | Qué ejecuta | Cuándo se ejecuta | Propósito |
|--------------|-------------|-------------------|-----------|
| **Standard Tests** | Tests básicos en dev/staging | Cada push/PR | Validación rápida |
| **Regression Tests** | 🔄 **TODOS los tests** | Push a main o manual | Validación completa |
| **Smoke Tests** | Solo tests @smoke | Push a main | Validación crítica |
| **Nightly Tests** | Suite completa nocturna | 2:00 AM UTC diario | Validación exhaustiva |

## 🚀 Cómo ejecutar Tests de Regresión

### 1. 🤖 **Automático (CI/CD)**

#### ✅ Automático en `main`

```bash
# Se ejecuta automáticamente cuando haces push a main
git push origin main
```

#### 🔧 Manual desde GitHub Actions

1. Ve a **Actions** → **CI & Regression - Continuous Integration & Testing**
2. Click **Run workflow**
3. Selecciona:
   - ✅ **Run full regression tests**: `true`
   - 🎯 **Target environment**: `all` (o específico)
4. Click **Run workflow**

### 2. 💻 **Local (Scripts)**

#### Script PowerShell (Recomendado para Windows)

```powershell
# Regresión completa (TODOS los tests en todos los ambientes)
.\run-regression.ps1

# Regresión en ambiente específico
.\run-regression.ps1 -Environment dev -Browser firefox

# Solo tests marcados con @regression
.\run-regression.ps1 -TaggedOnly

# Regresión en modo CI (sin reportes)
.\run-regression.ps1 -Environment staging -CI
```

#### Script Bash (Linux/macOS)

```bash
# Regresión completa
./run-regression.sh

# Ambiente específico
./run-regression.sh dev chromium

# Hacer el script ejecutable primero
chmod +x run-regression.sh
```

#### Comandos NPM directos

```bash
# Tests marcados con @regression únicamente
npm run test:regression

# TODOS los tests (regresión completa)
npm run test:regression:all

# Regresión por ambiente específico
npm run test:regression:dev
npm run test:regression:staging
npm run test:regression:prod

# Regresión completa secuencial
npm run regression:complete
```

### 3. 🔧 **Scripts batch existentes**

```batch
# Regresión con el script mejorado
run-tests.bat dev regression
run-tests.bat staging regression
run-tests.bat prod regression
```

## 🏷️ Cómo marcar tests para regresión

### Opción 1: Tag @regression (Solo tests específicos)

```javascript
// En tus archivos .spec.ts
test('Login completo @regression', async ({ page }) => {
  // Test crítico que debe estar en regresión
});

test('CRUD de afiliados @regression', async ({ page }) => {
  // Otro test crítico
});
```

### Opción 2: Regresión completa (TODOS los tests)

No necesitas tags. El sistema ejecuta **TODOS** los tests existentes.

## 📊 Configuración del CI/CD

### ⚙️ Matriz de ejecución automática

Cuando se ejecuta regresión en CI, corre:

```yaml
# Ambientes: dev, staging, prod
# Browsers: chromium, firefox
# Total: 6 combinaciones

Matrix:
- dev + chromium
- dev + firefox  
- staging + chromium
- staging + firefox
- prod + chromium
- prod + firefox
```

### 🎯 Triggers automáticos

| Acción | Regresión ejecuta |
|--------|-------------------|
| Push a `main` | ✅ Automático |
| Push a `develop` | ❌ No |
| Pull Request | ❌ No |
| Manual trigger | ✅ Si se activa |
| Nightly | ✅ Separado |

## 📈 Reportes y Artefactos

### 📁 Ubicación de reportes locales

```text
regression-reports/
├── dev-chromium/
│   └── index.html
├── staging-firefox/
│   └── index.html
└── prod-chromium/
    └── index.html
```

### 🏷️ Artefactos de CI/CD

- **Retención**: 60 días (vs 30 días para tests standard)
- **Naming**: `regression-report-{environment}-{browser}`
- **Incluye**: HTML reports + raw test results

## 🎛️ Configuraciones avanzadas

### 🚀 Ejecutar con parámetros específicos

```powershell
# Solo en staging, con Firefox, sin reportes
.\run-regression.ps1 -Environment staging -Browser firefox -SkipReport

# En modo CI (output mínimo)
.\run-regression.ps1 -CI

# Solo tests @regression (no todos)
.\run-regression.ps1 -TaggedOnly
```

### 🔧 Variables de ambiente

```bash
# Para scripts personalizados
export TEST_ENV=staging
export REGRESSION_MODE=complete
npx playwright test
```

## 🎯 Mejores prácticas

### ✅ **DO - Recomendado**

- ✅ Ejecuta regresión antes de releases importantes
- ✅ Usa regresión completa para validar cambios críticos
- ✅ Revisa los reportes cuando fallen tests
- ✅ Ejecuta regresión local antes de push a main

### ❌ **DON'T - Evitar**

- ❌ No ejecutes regresión en cada PR (es muy lento)
- ❌ No ignores fallos de regresión
- ❌ No hagas push a main sin validar localmente

## 🚨 Solución de problemas

### ❌ Error: "Tests failed in regression"

1. **Revisa el reporte HTML** en `regression-reports/`
2. **Identifica el test fallido** y el ambiente
3. **Ejecuta localmente** ese ambiente específico
4. **Debuggea** con `--debug` si es necesario

### ⚠️ Warning: "Regression taking too long"

1. **Considera usar** `--workers=2` para paralelizar
2. **Ejecuta solo ambiente específico** durante desarrollo
3. **Usa TaggedOnly** para tests críticos únicamente

### 🔧 Error: "Environment not responding"

1. **Verifica** que el servidor esté corriendo (port 3001)
2. **Revisa** la configuración en `environments.json`
3. **Valida** conectividad de red

## 🎉 Resumen rápido

```bash
# Para desarrollo diario
npm run test:regression          # Solo tests @regression

# Para validación completa  
.\run-regression.ps1            # TODOS los tests, todos los ambientes

# Para CI/CD
# → Automático en push a main
# → Manual via GitHub Actions

# Para ambiente específico
.\run-regression.ps1 -Environment dev
```

---

**🎯 El sistema de regresión está diseñado para darte confianza total en tus cambios. ¡Úsalo antes de releases importantes!**
