#!/bin/bash
# Script para ejecutar tests de regresión completos
# Uso: ./run-regression.sh [environment] [browser]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con colores
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_header() { echo -e "${PURPLE}🔄 $1${NC}"; }

# Configuración por defecto
ENVIRONMENT=${1:-"all"}
BROWSER=${2:-"chromium"}

log_header "REGRESSION TEST SUITE"
echo "========================================"
log_info "Environment: $ENVIRONMENT"
log_info "Browser: $BROWSER"
log_info "Date: $(date)"
echo ""

# Verificar dependencias
log_info "Checking dependencies..."
if ! command -v npm &> /dev/null; then
    log_error "npm not found. Please install Node.js"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    log_error "npx not found. Please install Node.js"
    exit 1
fi

log_success "Dependencies OK"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    log_warning "node_modules not found, installing dependencies..."
    npm ci
    log_success "Dependencies installed"
fi

# Función para ejecutar tests en un ambiente específico
run_tests_for_env() {
    local env=$1
    local browser=$2
    
    log_header "Running regression tests for $env environment"
    
    export TEST_ENV=$env
    
    # Crear directorio de reportes específico
    mkdir -p "regression-reports/$env-$browser"
    
    # Ejecutar todos los tests
    log_info "Executing ALL tests (complete regression suite)..."
    
    if npx playwright test --project=$browser --reporter=html --output-dir="regression-reports/$env-$browser"; then
        log_success "✅ Regression tests passed for $env ($browser)"
        return 0
    else
        log_error "❌ Regression tests failed for $env ($browser)"
        return 1
    fi
}

# Función para ejecutar tests específicos de regresión (con tag @regression)
run_regression_tagged_tests() {
    local env=$1
    local browser=$2
    
    log_header "Running @regression tagged tests for $env environment"
    
    export TEST_ENV=$env
    
    # Ejecutar solo tests marcados con @regression
    log_info "Executing tests marked with @regression tag..."
    
    if npx playwright test --grep "@regression" --project=$browser; then
        log_success "✅ @regression tagged tests passed for $env ($browser)"
        return 0
    else
        log_error "❌ @regression tagged tests failed for $env ($browser)"
        return 1
    fi
}

# Ejecutar tests según configuración
failed_envs=()
start_time=$(date +%s)

if [ "$ENVIRONMENT" = "all" ]; then
    log_header "Running regression tests for ALL environments"
    
    for env in dev staging prod; do
        log_info "Starting regression tests for $env..."
        
        # Opción 1: Ejecutar TODOS los tests (regresión completa)
        if run_tests_for_env $env $BROWSER; then
            log_success "Environment $env: PASSED"
        else
            log_error "Environment $env: FAILED"
            failed_envs+=($env)
        fi
        
        echo ""
        
        # Opción 2: También ejecutar tests específicos @regression
        log_info "Running @regression tagged tests for $env..."
        run_regression_tagged_tests $env $BROWSER
        
        echo "----------------------------------------"
    done
else
    log_header "Running regression tests for $ENVIRONMENT environment"
    
    # Ejecutar para ambiente específico
    if run_tests_for_env $ENVIRONMENT $BROWSER; then
        log_success "Environment $ENVIRONMENT: PASSED"
    else
        log_error "Environment $ENVIRONMENT: FAILED"
        failed_envs+=($ENVIRONMENT)
    fi
    
    # También ejecutar tests @regression
    echo ""
    log_info "Running @regression tagged tests for $ENVIRONMENT..."
    run_regression_tagged_tests $ENVIRONMENT $BROWSER
fi

# Resultados finales
end_time=$(date +%s)
duration=$((end_time - start_time))

echo ""
log_header "REGRESSION TEST RESULTS"
echo "========================================"
log_info "Total execution time: ${duration}s"

if [ ${#failed_envs[@]} -eq 0 ]; then
    log_success "🎉 ALL regression tests passed!"
    log_info "Reports available in: regression-reports/"
    
    # Abrir reporte si está disponible
    if command -v open &> /dev/null; then
        log_info "Opening test report..."
        open "regression-reports/*/index.html" 2>/dev/null || true
    fi
    
    exit 0
else
    log_error "❌ Regression tests failed for: ${failed_envs[*]}"
    log_warning "Check the reports in regression-reports/ for details"
    exit 1
fi
