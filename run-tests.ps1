# PowerShell Script para CI/CD Testing
# Versión mejorada del batch script con mejor manejo de errores

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'staging', 'prod', 'local')]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('login', 'afiliados', 'smoke', 'regression', 'all')]
    [string]$TestType = 'all',
    
    [Parameter(Mandatory=$false)]
    [switch]$CI,
    
    [Parameter(Mandatory=$false)]
    [switch]$NoReport,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('chromium', 'firefox', 'webkit')]
    [string]$Browser,
    
    [Parameter(Mandatory=$false)]
    [switch]$Headed
)

# Colores para output
$Colors = @{
    Success = 'Green'
    Error = 'Red'
    Warning = 'Yellow'
    Info = 'Cyan'
    Header = 'Magenta'
}

function Write-ColorText {
    param([string]$Text, [string]$Color = 'White')
    Write-Host $Text -ForegroundColor $Colors[$Color]
}

# Header
Write-ColorText "========================================" -Color Header
Write-ColorText "   PLAYWRIGHT TEST ENVIRONMENT RUNNER" -Color Header
Write-ColorText "        PowerShell CI/CD Version" -Color Header
Write-ColorText "========================================" -Color Header
Write-Host ""

# Información del entorno
Write-ColorText "🌍 Ambiente de testing: $Environment" -Color Info
Write-ColorText "🧪 Tipo de test: $TestType" -Color Info
Write-ColorText "📅 Fecha/Hora: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -Color Info

if ($Browser) {
    Write-ColorText "🌐 Browser: $Browser" -Color Info
}

if ($Headed) {
    Write-ColorText "👁️ Modo: Con interfaz gráfica" -Color Info
}

if ($CI) {
    Write-ColorText "🤖 Modo CI/CD activado" -Color Warning
}

Write-Host ""

# Configurar variable de ambiente
$env:TEST_ENV = $Environment

# Determinar comando base
$baseCommand = switch ($TestType) {
    'login' { 'npm run test:login' }
    'afiliados' { 'npm run test:afiliados' }
    'smoke' { 'npm run test:smoke' }
    'regression' { 'npm run test:regression' }
    default { 'npm test' }
}

# Agregar modificadores del comando
$command = $baseCommand

if ($Browser) {
    $command += " --project=$Browser"
}

if ($Headed) {
    $command += " --headed"
}

if ($CI) {
    $command += " --reporter=line"
}

Write-ColorText "🚀 Comando a ejecutar: $command" -Color Info
Write-Host ""

# Verificar que npm está disponible
try {
    $npmVersion = npm --version
    Write-ColorText "✅ npm disponible (versión: $npmVersion)" -Color Success
} catch {
    Write-ColorText "❌ Error: npm no está disponible" -Color Error
    exit 1
}

# Verificar que las dependencias están instaladas
if (-not (Test-Path "node_modules")) {
    Write-ColorText "⚠️ node_modules no encontrado, instalando dependencias..." -Color Warning
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-ColorText "❌ Error instalando dependencias" -Color Error
        exit 1
    }
}

# Ejecutar tests
Write-ColorText "========================================" -Color Header
Write-ColorText "🧪 Iniciando tests..." -Color Info
Write-ColorText "========================================" -Color Header

$startTime = Get-Date

try {
    # Ejecutar el comando
    Invoke-Expression $command
    $testExitCode = $LASTEXITCODE
    
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host ""
    Write-ColorText "========================================" -Color Header
    
    if ($testExitCode -eq 0) {
        Write-ColorText "✅ Tests completados exitosamente" -Color Success
        Write-ColorText "⏱️ Duración: $($duration.ToString('hh\:mm\:ss'))" -Color Info
    } else {
        Write-ColorText "❌ Tests fallaron (código: $testExitCode)" -Color Error
        Write-ColorText "⏱️ Duración: $($duration.ToString('hh\:mm\:ss'))" -Color Info
    }
    
    # Mostrar reporte solo si no es CI y no se especificó NoReport
    if (-not $CI -and -not $NoReport) {
        Write-Host ""
        Write-ColorText "📊 Abriendo reporte de tests..." -Color Info
        
        # Esperar un momento para que el usuario vea el resultado
        Start-Sleep -Seconds 2
        
        npm run test:report
    }
    
    # Información adicional en modo CI
    if ($CI) {
        Write-Host ""
        Write-ColorText "=== CI/CD Information ===" -Color Header
        Write-ColorText "Environment: $Environment" -Color Info
        Write-ColorText "Test Type: $TestType" -Color Info
        Write-ColorText "Exit Code: $testExitCode" -Color Info
        Write-ColorText "Duration: $($duration.ToString('hh\:mm\:ss'))" -Color Info
        
        if ($env:GITHUB_ACTIONS) {
            Write-ColorText "GitHub Actions: $env:GITHUB_ACTIONS" -Color Info
            Write-ColorText "Workflow: $env:GITHUB_WORKFLOW" -Color Info
            Write-ColorText "Run ID: $env:GITHUB_RUN_ID" -Color Info
        }
    }
    
    exit $testExitCode
    
} catch {
    Write-ColorText "❌ Error ejecutando tests: $($_.Exception.Message)" -Color Error
    exit 1
}

# Función de ayuda
function Show-Help {
    Write-ColorText "📚 Uso del script:" -Color Header
    Write-Host ""
    Write-ColorText ".\run-tests.ps1 -Environment <ambiente> [-TestType <tipo>] [-CI] [-NoReport] [-Browser <browser>] [-Headed]" -Color Info
    Write-Host ""
    Write-ColorText "Parámetros:" -Color Header
    Write-ColorText "  -Environment: dev, staging, prod, local (requerido)" -Color Info
    Write-ColorText "  -TestType: login, afiliados, smoke, regression, all (opcional, default: all)" -Color Info
    Write-ColorText "  -CI: Modo CI/CD (opcional)" -Color Info
    Write-ColorText "  -NoReport: No mostrar reporte al final (opcional)" -Color Info
    Write-ColorText "  -Browser: chromium, firefox, webkit (opcional)" -Color Info
    Write-ColorText "  -Headed: Ejecutar con interfaz gráfica (opcional)" -Color Info
    Write-Host ""
    Write-ColorText "Ejemplos:" -Color Header
    Write-ColorText "  .\run-tests.ps1 -Environment dev" -Color Info
    Write-ColorText "  .\run-tests.ps1 -Environment staging -TestType login" -Color Info
    Write-ColorText "  .\run-tests.ps1 -Environment prod -TestType smoke -CI" -Color Info
    Write-ColorText "  .\run-tests.ps1 -Environment dev -Browser firefox -Headed" -Color Info
}
