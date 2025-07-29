# 🚀 CI/CD Configuration for React TS Login

## 📋 Overview

Este proyecto utiliza GitHub Actions para implementar un pipeline completo de CI/CD que incluye:

- ✅ **Continuous Integration (CI)**: Tests automáticos en cada push/PR
- 🚀 **Continuous Deployment (CD)**: Deploy automático a diferentes ambientes
- 🌙 **Nightly Tests**: Suite completa de tests de regresión
- 🔍 **PR Validation**: Validación específica para Pull Requests
- 🏷️ **Release Management**: Gestión automática de releases

## 🔄 Workflows Disponibles

### 1. CI & Regression - Continuous Integration & Testing (`regression.yml`)

**Trigger**: Push a `main`/`develop`, Pull Requests

- 🔍 Code quality & linting
- 🧪 Tests en matriz (dev/staging × chromium/firefox/webkit)
- 💨 Smoke tests en producción (solo main)
- 📊 Reporte consolidado de tests

### 2. CD - Continuous Deployment (`cd.yml`)

**Trigger**: Push a `main`/`develop`, Tags `v*`, Manual

- 🎯 Determinación automática de ambiente
- 🧪 Tests pre-deployment
- 🏗️ Build y empaquetado
- 🚀 Deploy automático (staging/production)
- 📢 Notificaciones de estado

### 3. Nightly Tests (`nightly.yml`)

**Trigger**: Cron diario 2:00 AM UTC, Manual

- 🌙 Suite completa de tests de regresión
- ⚡ Tests de performance
- 📋 Reportes consolidados
- 📧 Notificaciones de fallas

### 4. PR Check (`pr-check.yml`)

**Trigger**: Pull Requests a `main`/`develop`

- ⚡ Validación rápida (lint + build)
- 🎯 Tests específicos basados en cambios
- 👁️ Tests de regresión visual (opcional)
- 🔒 Escaneo básico de seguridad

### 5. Release (`release.yml`)

**Trigger**: Tags `v*.*.*`, Manual

- ✅ Validación completa de release
- 🧪 Tests pre-release exhaustivos
- 🏗️ Build de artifacts de release
- 🎉 Creación automática de GitHub Release
- 🚀 Deploy a producción

## 🎯 Estrategia de Ambientes

### Ambientes de Testing

- **dev**: Desarrollo local (localhost:3001)
- **staging**: Ambiente de staging
- **prod**: Producción
- **local**: Testing local específico

### Estrategia de Deploy

- **main** → Production
- **develop** → Staging
- **tags v*.*.*** → Production Release
- **PRs** → Validation only

## 📊 Matriz de Tests

| Ambiente | Browser | CI | Nightly | PR Check |
|----------|---------|----|---------| ---------|
| dev      | Chrome  | ✅ | ✅      | ✅       |
| dev      | Firefox | ✅ | ✅      | ❌       |
| dev      | Safari  | ❌ | ✅      | ❌       |
| staging  | Chrome  | ✅ | ✅      | ✅       |
| staging  | Firefox | ✅ | ✅      | ❌       |
| staging  | Safari  | ❌ | ✅      | ❌       |
| prod     | Chrome  | 💨 | ✅      | ❌       |

**Leyenda**: ✅ Full tests, 💨 Smoke tests, ❌ Not included

## 🔧 Configuración de Secrets

### Required Secrets

```bash
# No hay secrets requeridos por defecto
# Los workflows usan GITHUB_TOKEN automático
```

### Optional Secrets (para integraciones)

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/...     # Notificaciones Slack
TEAMS_WEBHOOK_URL=https://...                      # Notificaciones Teams
AWS_ACCESS_KEY_ID=AKIA...                         # Deploy AWS
AWS_SECRET_ACCESS_KEY=...                         # Deploy AWS
NETLIFY_AUTH_TOKEN=...                            # Deploy Netlify
```

## 📈 Uso de los Workflows

### Ejecutar CI manualmente

```bash
# Via GitHub UI: Actions → CI → Run workflow
# O hacer push a main/develop
git push origin main
```

### Ejecutar tests específicos

```bash
# Via GitHub UI: Actions → Nightly Tests → Run workflow
# Seleccionar tipo de test y ambientes
```

### Crear un release

```bash
# Método 1: Via tags
npm version minor
git push && git push --tags

# Método 2: Via scripts
npm run release:minor

# Método 3: Manual via GitHub UI
# Actions → Release → Run workflow
```

### Validar PR

```bash
# Automático al crear/actualizar PR
# Para tests visuales, agregar label "visual-tests"
```

## 🛠️ Scripts NPM para CI/CD

```json
{
  "scripts": {
    "ci:install": "npm ci",
    "ci:lint": "npm run lint",
    "ci:build": "npm run build",
    "ci:test": "npm run test",
    "ci:test:dev": "npm run test:dev",
    "ci:test:staging": "npm run test:staging",
    "ci:test:prod": "npm run test:prod",
    "release:patch": "npm version patch && git push && git push --tags",
    "release:minor": "npm version minor && git push && git push --tags",
    "release:major": "npm version major && git push && git push --tags"
  }
}
```

## 📋 Checklist de Setup

### Initial Setup

- [x] ✅ Workflows creados en `.github/workflows/`
- [x] ✅ Scripts NPM actualizados
- [x] ✅ Configuración de ambientes en `environments.json`
- [ ] 🔧 Configurar URLs reales de staging/production
- [ ] 🔧 Configurar comandos de deploy específicos
- [ ] 🔧 Configurar secrets si es necesario

### Testing Setup

- [x] ✅ Playwright configurado para multi-ambiente
- [x] ✅ JSON de configuración separado
- [x] ✅ Scripts de test por ambiente
- [ ] 🔧 Agregar tags @smoke y @regression a tests
- [ ] 🔧 Configurar tests de performance si aplica

### Deployment Setup

- [ ] 🔧 Configurar plataforma de deploy (AWS/Netlify/Vercel/etc)
- [ ] 🔧 Actualizar comandos de deploy en workflows
- [ ] 🔧 Configurar health checks post-deployment
- [ ] 🔧 Configurar rollback automático si aplica

### Notifications Setup

- [ ] 🔧 Configurar webhook de Slack/Teams si se desea
- [ ] 🔧 Configurar email notifications
- [ ] 🔧 Configurar integración con herramientas de monitoring

## 🚦 Status Badges

Agregar estos badges al README.md:

```markdown
![CI](https://github.com/tu-usuario/react-ts-login/workflows/CI/badge.svg)
![CD](https://github.com/tu-usuario/react-ts-login/workflows/CD/badge.svg)
![Nightly](https://github.com/tu-usuario/react-ts-login/workflows/Nightly/badge.svg)
```

## 🔍 Monitoring y Alertas

### Métricas a Monitorear

- ✅ Success rate de tests
- ⏱️ Tiempo de ejecución de workflows
- 🚀 Frecuencia de deploys
- 🐛 Tasa de fallas en production

### Alertas Configurables

- ❌ Falla de tests nocturnos
- ⚠️ Deploy fallido
- 🚨 Tests de smoke en producción fallando
- 📈 Tiempo de tests excesivo

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Nota**: Este setup proporciona una base sólida para CI/CD. Personaliza los comandos de deploy y configuraciones según tu infraestructura específica.
