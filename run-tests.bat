@echo off
REM Script para ejecutar tests en diferentes ambientes con soporte CI/CD

echo ========================================
echo    PLAYWRIGHT TEST ENVIRONMENT RUNNER
echo           CI/CD Enhanced Version
echo ========================================
echo.

if "%1"=="" (
    echo Uso: run-tests.bat [ambiente] [opcional: tipo]
    echo.
    echo Ambientes disponibles:
    echo   dev      - Desarrollo local
    echo   staging  - Ambiente de staging  
    echo   prod     - Produccion
    echo   local    - Testing local
    echo.
    echo Tipos de test opcionales:
    echo   login    - Solo tests de login
    echo   afiliados - Solo tests de afiliados
    echo   smoke    - Tests de smoke
    echo   regression - Tests de regresion
    echo   all      - Todos los tests ^(por defecto^)
    echo.
    echo Ejemplos:
    echo   run-tests.bat dev
    echo   run-tests.bat staging login
    echo   run-tests.bat prod smoke
    echo   run-tests.bat staging regression
    echo.
    echo Scripts CI/CD disponibles:
    echo   npm run ci:test:dev      - Tests CI para dev
    echo   npm run ci:test:staging  - Tests CI para staging
    echo   npm run ci:test:prod     - Tests CI para prod
    echo   npm run release:minor    - Release minor version
    echo.
    pause
    exit /b 1
)

set TEST_ENV=%1
set TEST_TYPE=%2

echo Ejecutando tests en ambiente: %TEST_ENV%
echo Fecha/Hora: %DATE% %TIME%

REM Verificar si el ambiente es válido
if not "%TEST_ENV%"=="dev" if not "%TEST_ENV%"=="staging" if not "%TEST_ENV%"=="prod" if not "%TEST_ENV%"=="local" (
    echo ❌ Error: Ambiente '%TEST_ENV%' no es válido
    echo Ambientes válidos: dev, staging, prod, local
    pause
    exit /b 1
)

REM Configurar comando según tipo de test
if "%TEST_TYPE%"=="login" (
    echo Tipo: Solo tests de login
    set TEST_COMMAND=npm run test:login
) else if "%TEST_TYPE%"=="afiliados" (
    echo Tipo: Solo tests de afiliados  
    set TEST_COMMAND=npm run test:afiliados
) else if "%TEST_TYPE%"=="smoke" (
    echo Tipo: Tests de smoke
    set TEST_COMMAND=npm run test:smoke
) else if "%TEST_TYPE%"=="regression" (
    echo Tipo: Tests de regresión
    set TEST_COMMAND=npm run test:regression
) else (
    echo Tipo: Todos los tests
    set TEST_COMMAND=npm test
)

echo Comando: %TEST_COMMAND%
echo.

REM Verificar si es ambiente CI
if defined CI (
    echo 🤖 Detectado ambiente CI/CD
    echo Ejecutando en modo CI...
) else (
    echo 💻 Ejecutando en modo local
)

echo Iniciando tests...
echo ========================================

REM Configurar variable de ambiente y ejecutar
set TEST_ENV=%TEST_ENV%

REM Ejecutar el comando correspondiente
if "%TEST_TYPE%"=="login" (
    call npm run test:login
) else if "%TEST_TYPE%"=="afiliados" (
    call npm run test:afiliados  
) else if "%TEST_TYPE%"=="smoke" (
    call npm run test:smoke
) else if "%TEST_TYPE%"=="regression" (
    call npm run test:regression
) else (
    call npm test
)

set TEST_EXIT_CODE=%ERRORLEVEL%

echo ========================================
if %TEST_EXIT_CODE% equ 0 (
    echo ✅ Tests completados exitosamente
) else (
    echo ❌ Tests fallaron (código: %TEST_EXIT_CODE%^)
)

REM Solo mostrar reporte en modo local
if not defined CI (
    echo.
    echo Presiona cualquier tecla para ver el reporte...
    pause > nul
    npm run test:report
)

exit /b %TEST_EXIT_CODE%
