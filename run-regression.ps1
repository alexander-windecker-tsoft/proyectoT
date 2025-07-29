# PowerShell Script para Tests de Regresión Completos
# Uso: .\run-regression.ps1 [-Environment "all"] [-Browser "chromium"] [-TaggedOnly]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('all', 'dev', 'staging', 'prod')]
    [string]$Environment = 'all',
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('chromium', 'firefox', 'webkit')]
    [string]$Browser = 'chromium',
    
    [Parameter(Mandatory=$false)]
    [switch]$TaggedOnly,  # Solo ejecutar tests marcados con @regression
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipReport,
    
    [Parameter(Mandatory=$false)]
    [switch]$CI
)

# Colores para output
$Colors = @{
    Success = 'Green'
    Error = 'Red'
    Warning = 'Yellow'
    Info = 'Cyan'
    Header = 'Magenta'
    Highlight = 'Blue'
}

function Write-ColorText {
    param([string]$Text, [string]$Color = 'White', [switch]$NoNewline)
    if ($NoNewline) {
        Write-Host $Text -ForegroundColor $Colors[$Color] -NoNewline
    } else {
        Write-Host $Text -ForegroundColor $Colors[$Color]
    }
}

# Header
Write-ColorText "========================================" -Color Header
Write-ColorText "🔄 REGRESSION TEST SUITE - COMPLETE" -Color Header
Write-ColorText "========================================" -Color Header
Write-Host ""

Write-ColorText "🌍 Environment: $Environment" -Color Info
Write-ColorText "🌐 Browser: $Browser" -Color Info
Write-ColorText "📅 Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -Color Info

if ($TaggedOnly) {
    Write-ColorText "🏷️ Mode: Only @regression tagged tests" -Color Warning
} else {
    Write-ColorText "🔄 Mode: ALL tests (complete regression)" -Color Info
}

if ($CI) {
    Write-ColorText "🤖 CI Mode: Enabled" -Color Warning
}

Write-Host ""

# Verificar dependencias
Write-ColorText "🔍 Checking dependencies..." -Color Info

try {
    $npmVersion = npm --version
    Write-ColorText "✅ npm available (version: $npmVersion)" -Color Success
} catch {
    Write-ColorText "❌ npm not found. Please install Node.js" -Color Error
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-ColorText "⚠️ node_modules not found, installing dependencies..." -Color Warning
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-ColorText "❌ Error installing dependencies" -Color Error
        exit 1
    }
    Write-ColorText "✅ Dependencies installed" -Color Success
}

# Función para ejecutar tests de regresión
function Invoke-RegressionTests {
    param(
        [string]$TestEnvironment,
        [string]$TestBrowser,
        [bool]$OnlyTagged = $false
    )
    
    $env:TEST_ENV = $TestEnvironment
    
    Write-ColorText "🔄 Starting regression tests for $TestEnvironment environment..." -Color Header
    Write-ColorText "🌐 Browser: $TestBrowser" -Color Info
    
    # Crear directorio de reportes
    $reportDir = "regression-reports\$TestEnvironment-$TestBrowser"
    New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
    
    $startTime = Get-Date
    
    try {
        if ($OnlyTagged) {
            Write-ColorText "🏷️ Executing only @regression tagged tests..." -Color Info
            $command = "npx playwright test --grep `"@regression`" --project=$TestBrowser"
        } else {
            Write-ColorText "🔄 Executing ALL tests (complete regression suite)..." -Color Info
            $command = "npx playwright test --project=$TestBrowser"
        }
        
        if ($CI) {
            $command += " --reporter=line"
        } else {
            $command += " --reporter=html"
        }
        
        Write-ColorText "📋 Command: $command" -Color Highlight
        
        Invoke-Expression $command
        
        if ($LASTEXITCODE -eq 0) {
            $endTime = Get-Date
            $duration = $endTime - $startTime
            Write-ColorText "✅ Regression tests PASSED for $TestEnvironment ($TestBrowser)" -Color Success
            Write-ColorText "⏱️ Duration: $($duration.ToString('hh\:mm\:ss'))" -Color Info
            return $true
        } else {
            Write-ColorText "❌ Regression tests FAILED for $TestEnvironment ($TestBrowser)" -Color Error
            return $false
        }
        
    } catch {
        Write-ColorText "❌ Error executing tests: $($_.Exception.Message)" -Color Error
        return $false
    }
}

# Variables para tracking
$failedEnvironments = @()
$totalStartTime = Get-Date
$results = @()

# Ejecutar tests según configuración
if ($Environment -eq 'all') {
    Write-ColorText "🌍 Running regression tests for ALL environments" -Color Header
    Write-Host ""
    
    $environments = @('dev', 'staging', 'prod')
    
    foreach ($env in $environments) {
        Write-ColorText "========================================" -Color Header
        Write-ColorText "🎯 Testing Environment: $env" -Color Header
        Write-ColorText "========================================" -Color Header
        
        $success = Invoke-RegressionTests -TestEnvironment $env -TestBrowser $Browser -OnlyTagged $TaggedOnly
        
        $results += [PSCustomObject]@{
            Environment = $env
            Browser = $Browser
            Success = $success
            TestType = if ($TaggedOnly) { "@regression only" } else { "All tests" }
        }
        
        if (-not $success) {
            $failedEnvironments += $env
        }
        
        Write-Host ""
    }
} else {
    Write-ColorText "🎯 Running regression tests for $Environment environment" -Color Header
    Write-Host ""
    
    $success = Invoke-RegressionTests -TestEnvironment $Environment -TestBrowser $Browser -OnlyTagged $TaggedOnly
    
    $results += [PSCustomObject]@{
        Environment = $Environment
        Browser = $Browser
        Success = $success
        TestType = if ($TaggedOnly) { "@regression only" } else { "All tests" }
    }
    
    if (-not $success) {
        $failedEnvironments += $Environment
    }
}

# Resultados finales
$totalEndTime = Get-Date
$totalDuration = $totalEndTime - $totalStartTime

Write-Host ""
Write-ColorText "========================================" -Color Header
Write-ColorText "📊 REGRESSION TEST RESULTS SUMMARY" -Color Header
Write-ColorText "========================================" -Color Header

Write-ColorText "⏱️ Total execution time: $($totalDuration.ToString('hh\:mm\:ss'))" -Color Info
Write-ColorText "🧪 Test type: $(if ($TaggedOnly) { '@regression tagged only' } else { 'Complete regression (all tests)' })" -Color Info
Write-ColorText "🌐 Browser: $Browser" -Color Info
Write-Host ""

# Tabla de resultados
Write-ColorText "📋 Detailed Results:" -Color Header
Write-Host ""
Write-Host "Environment".PadRight(12) "Browser".PadRight(10) "Type".PadRight(20) "Result" -ForegroundColor $Colors.Header
Write-Host ("-" * 50) -ForegroundColor $Colors.Header

foreach ($result in $results) {
    $status = if ($result.Success) { "✅ PASSED" } else { "❌ FAILED" }
    $color = if ($result.Success) { $Colors.Success } else { $Colors.Error }
    
    Write-Host $result.Environment.PadRight(12) -NoNewline
    Write-Host $result.Browser.PadRight(10) -NoNewline
    Write-Host $result.TestType.PadRight(20) -NoNewline
    Write-Host $status -ForegroundColor $color
}

Write-Host ""

# Resultado final
if ($failedEnvironments.Count -eq 0) {
    Write-ColorText "🎉 ALL REGRESSION TESTS PASSED!" -Color Success
    Write-ColorText "📊 Reports available in: regression-reports\" -Color Info
    
    # Abrir reporte si no es CI y no se especificó SkipReport
    if (-not $CI -and -not $SkipReport) {
        Write-ColorText "📈 Opening test reports..." -Color Info
        Start-Sleep -Seconds 2
        
        # Buscar y abrir reportes HTML
        Get-ChildItem -Path "regression-reports" -Filter "index.html" -Recurse | ForEach-Object {
            try {
                Start-Process $_.FullName
            } catch {
                Write-ColorText "⚠️ Could not open report: $($_.FullName)" -Color Warning
            }
        }
    }
    
    exit 0
} else {
    Write-ColorText "❌ REGRESSION TESTS FAILED for environments: $($failedEnvironments -join ', ')" -Color Error
    Write-ColorText "🔍 Check the reports in regression-reports\ for details" -Color Warning
    
    if ($CI) {
        Write-ColorText "🤖 CI Mode: Detailed logs available in workflow artifacts" -Color Info
    }
    
    exit 1
}

# Función de ayuda
function Show-RegressionHelp {
    Write-ColorText "📚 Regression Test Script Usage:" -Color Header
    Write-Host ""
    Write-ColorText ".\run-regression.ps1 [-Environment <env>] [-Browser <browser>] [-TaggedOnly] [-SkipReport] [-CI]" -Color Info
    Write-Host ""
    Write-ColorText "Parameters:" -Color Header
    Write-ColorText "  -Environment: all, dev, staging, prod (default: all)" -Color Info
    Write-ColorText "  -Browser: chromium, firefox, webkit (default: chromium)" -Color Info
    Write-ColorText "  -TaggedOnly: Only run tests marked with @regression" -Color Info
    Write-ColorText "  -SkipReport: Don't open reports at the end" -Color Info
    Write-ColorText "  -CI: CI mode (minimal output)" -Color Info
    Write-Host ""
    Write-ColorText "Examples:" -Color Header
    Write-ColorText "  .\run-regression.ps1" -Color Info
    Write-ColorText "  .\run-regression.ps1 -Environment dev -Browser firefox" -Color Info
    Write-ColorText "  .\run-regression.ps1 -Environment all -TaggedOnly" -Color Info
    Write-ColorText "  .\run-regression.ps1 -Environment staging -CI" -Color Info
}
