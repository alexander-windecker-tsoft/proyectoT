# GitHub Actions Settings
# Este archivo documenta las configuraciones recomendadas para el repositorio

## 🔧 Repository Settings

### Branch Protection Rules
Configurar en: Settings → Branches → Add rule

**Para rama `main`:**
- [x] Require pull request reviews before merging
  - Required number of reviewers: 1
  - [x] Dismiss stale PR approvals when new commits are pushed
  - [x] Require review from code owners
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `CI / Code Quality & Linting`
    - `CI / Playwright Tests (dev, chromium)`
    - `CI / Playwright Tests (staging, chromium)`
- [x] Require conversation resolution before merging
- [x] Require linear history
- [x] Include administrators

**Para rama `develop`:**
- [x] Require pull request reviews before merging
  - Required number of reviewers: 1
- [x] Require status checks to pass before merging
  - Required status checks:
    - `CI / Code Quality & Linting`
    - `CI / Playwright Tests (dev, chromium)`

### Environment Protection Rules
Configurar en: Settings → Environments

**Environment: `production`**
- [x] Required reviewers: [admin-users]
- [x] Wait timer: 0 minutes
- [x] Deployment branches: Selected branches
  - Add branch: `main`

**Environment: `staging`**
- [x] Deployment branches: Selected branches
  - Add branches: `main`, `develop`

## 🎯 Actions Permissions

### General Settings
Configurar en: Settings → Actions → General

- **Actions permissions**: Allow all actions and reusable workflows
- **Fork pull request workflows**: Require approval for first-time contributors
- **Workflow permissions**: Read and write permissions
- [x] Allow GitHub Actions to create and approve pull requests

### Artifact and log retention
- **Artifact and log retention**: 90 days (para releases importantes)
- **Default retention**: 30 days (para CI regular)

## 🔐 Repository Secrets

### Required Secrets (ninguno por defecto)
Los workflows utilizan `GITHUB_TOKEN` automático.

### Optional Secrets (configurar según necesidad)

```bash
# Deployment
AWS_ACCESS_KEY_ID              # Para deploy en AWS
AWS_SECRET_ACCESS_KEY          # Para deploy en AWS
NETLIFY_AUTH_TOKEN            # Para deploy en Netlify
VERCEL_TOKEN                  # Para deploy en Vercel

# Notifications
SLACK_WEBHOOK_URL             # Para notificaciones Slack
TEAMS_WEBHOOK_URL             # Para notificaciones Teams

# Monitoring
DATADOG_API_KEY               # Para métricas Datadog
NEW_RELIC_LICENSE_KEY         # Para métricas New Relic

# External Services
CODECOV_TOKEN                 # Para reportes de cobertura
SONAR_TOKEN                   # Para análisis SonarQube
```

## 📊 Status Checks Configuration

### Required Status Checks
Para configurar en Branch Protection Rules:

```yaml
# CI Workflow
- "CI / Code Quality & Linting"
- "CI / Playwright Tests (dev, chromium)"
- "CI / Playwright Tests (staging, chromium)"
- "CI / Smoke Tests"

# PR Check Workflow  
- "PR Check / Quick Validation"
- "PR Check / Affected Tests (dev)"
- "PR Check / Security Scan"

# Release Workflow (para tags)
- "Release / Validate Release"
- "Release / Pre-Release Tests (staging, chromium)"
- "Release / Build Release Artifacts"
```

## 🚀 Auto-merge Configuration

### Setup Auto-merge (opcional)
```yaml
# En PR template (.github/pull_request_template.md)
- [ ] Tests pasan
- [ ] Code review completado
- [ ] Documentación actualizada
- [ ] Ready for auto-merge

# Auto-merge conditions:
- All required status checks pass
- At least 1 approval
- No requested changes
- No merge conflicts
```

## 📝 Issue and PR Templates

### Issue Template
```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: ['bug', 'triage']
assignees: ''

body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  
  - type: input
    id: environment
    attributes:
      label: Environment
      description: Which environment did you encounter this bug?
      options:
        - dev
        - staging
        - production
      default: dev
    validations:
      required: true
```

### PR Template
```yaml
# .github/pull_request_template.md
## 📋 Description
Brief description of changes

## 🧪 Testing
- [ ] Tests added/updated
- [ ] Tests pass locally
- [ ] Tested in dev environment

## 🔍 Code Review Checklist
- [ ] Code follows project conventions
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Documentation updated

## 🚀 Deployment Notes
Any special deployment considerations

## 📸 Screenshots (if applicable)
Visual changes or new features
```

## 🏷️ Labels Configuration

### Suggested Labels
```yaml
# Type
- bug: Bug reports
- feature: New features
- enhancement: Improvements
- documentation: Documentation updates
- refactor: Code refactoring

# Priority  
- priority/high: High priority
- priority/medium: Medium priority
- priority/low: Low priority

# Status
- status/ready: Ready for development
- status/in-progress: Currently being worked on
- status/blocked: Blocked by dependencies
- status/review: Needs review

# Testing
- needs-testing: Requires testing
- visual-tests: Needs visual regression tests
- e2e-tests: Needs end-to-end tests

# CI/CD
- ci-skip: Skip CI workflows
- deploy-staging: Deploy to staging
- deploy-prod: Deploy to production
```

## 🔄 Workflow Dispatch Inputs

### Common Workflow Inputs
```yaml
# Para workflows manuales
environment:
  description: 'Target environment'
  required: true
  default: 'staging'
  type: choice
  options:
    - dev
    - staging
    - production

test_type:
  description: 'Type of tests to run'
  required: false
  default: 'all'
  type: choice
  options:
    - all
    - smoke
    - regression
    - login
    - afiliados

skip_tests:
  description: 'Skip tests before deployment'
  required: false
  default: false
  type: boolean

debug_mode:
  description: 'Enable debug mode'
  required: false
  default: false
  type: boolean
```

## 📈 Monitoring and Metrics

### GitHub Insights to Monitor
- **Actions usage**: Monitor workflow execution time and costs
- **Code frequency**: Track deployment frequency
- **Pull requests**: Monitor review times and merge rates
- **Issues**: Track bug reports and feature requests

### Custom Metrics (via workflows)
- Test execution time per environment
- Deployment success rate
- Test failure patterns
- Performance regression detection

## 🛡️ Security Considerations

### Dependabot Configuration
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore"
      include: "scope"
    reviewers:
      - "admin-team"
    assignees:
      - "security-team"
```

### CodeQL Analysis
```yaml
# .github/workflows/codeql-analysis.yml
name: "CodeQL"
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 6 * * 1'  # Weekly on Mondays
```

---

**Nota**: Estas configuraciones deben ser aplicadas gradualmente según las necesidades del equipo y la criticidad del proyecto.
