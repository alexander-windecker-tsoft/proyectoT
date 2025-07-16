# Tests de Automatización - Gestión de Afiliados

## Descripción

Este proyecto incluye tests automatizados con Playwright para validar la funcionalidad de gestión de afiliados del Club de Natación.

## Casos de Prueba Implementados

### 1. Validación del Botón Guardar

- **Caso 1**: Verificar que el botón "Guardar" está deshabilitado cuando el formulario está vacío
- **Caso 2**: Verificar que el botón "Guardar" se habilita al completar todos los campos obligatorios

### 2. Happy Path - Creación de Afiliado

- **Caso 3**: Flujo completo de creación de un nuevo afiliado exitosamente

### 3. Casos Adicionales

- Navegación desde Dashboard a Afiliados
- Validación visual de campos obligatorios
- Búsqueda y filtrado en la lista de afiliados

## Estructura de Archivos

```
src/pages/
├── loginPage.ts              # Page Object para login
├── afiliadosFormPage.ts      # Page Object para formulario de afiliados
└── afiliadosListPage.ts      # Page Object para lista de afiliados

tests/
├── afiliados-principales.spec.ts    # Tests principales (3 casos solicitados)
├── afiliados-gestion.spec.ts        # Tests completos de gestión
└── test-data/
    └── afiliadosTestData.ts          # Datos de prueba reutilizables
```

## Comandos para Ejecutar Tests

### Prerequisitos

1. Asegúrate de que el proyecto React esté ejecutándose:

   ```bash
   npm run dev
   ```

   (El proyecto debe estar disponible en <http://localhost:5174>)

### Ejecutar Tests Principales (3 casos solicitados)

```bash
# Ejecutar con interfaz visual
npx playwright test afiliados-principales.spec.ts --headed

# Ejecutar en modo UI (recomendado para desarrollo)
npx playwright test afiliados-principales.spec.ts --ui

# Ejecutar en modo headless (sin interfaz)
npx playwright test afiliados-principales.spec.ts
```

### Ejecutar Todos los Tests de Afiliados

```bash
# Todos los archivos de test de afiliados
npx playwright test afiliados*.spec.ts --headed
```

### Ejecutar Tests Específicos

```bash
# Solo el caso del botón deshabilitado
npx playwright test afiliados-principales.spec.ts -g "Botón Guardar debe estar deshabilitado"

# Solo el happy path
npx playwright test afiliados-principales.spec.ts -g "Happy Path"
```

### Ver Reportes

```bash
# Generar y abrir reporte HTML
npx playwright show-report
```

## Casos de Prueba Detallados

### Caso 1: Botón Deshabilitado

**Objetivo**: Validar que el botón "Guardar" permanece deshabilitado cuando faltan campos obligatorios.

**Pasos**:

1. Navegar al formulario de nuevo afiliado
2. Verificar que el botón está deshabilitado inicialmente
3. Completar solo algunos campos (no todos los obligatorios)
4. Verificar que el botón sigue deshabilitado

### Caso 2: Botón Habilitado

**Objetivo**: Validar que el botón "Guardar" se habilita al completar todos los campos obligatorios.

**Pasos**:

1. Navegar al formulario de nuevo afiliado
2. Completar todos los campos obligatorios
3. Verificar que el botón se habilita

### Caso 3: Happy Path - Creación Exitosa

**Objetivo**: Validar el flujo completo de creación de un nuevo afiliado.

**Pasos**:

1. Ir a la lista de afiliados y obtener conteo inicial
2. Navegar al formulario de creación
3. Completar todos los campos obligatorios y algunos opcionales
4. Guardar el formulario
5. Verificar redirección a la lista
6. Verificar que el nuevo afiliado aparece en la lista
7. Verificar que el conteo de afiliados aumentó

## Datos de Prueba

Los tests utilizan datos únicos generados automáticamente para evitar conflictos. Los datos incluyen:

- **Campos Obligatorios**: nombre, apellidos, DNI, dirección completa, sexo, clases por semana, tipo de clase
- **Campos Opcionales**: teléfono, email, fecha de nacimiento, experiencia, observaciones

## Configuración

### Variables de Entorno

- `baseURL`: <http://localhost:5174> (configurado en playwright.config.ts)

### Navegadores

Los tests están configurados para ejecutarse en:

- Chromium (Chrome/Edge)
- Firefox
- Safari (en macOS)

## Troubleshooting

### Problemas Comunes

1. **Error de conexión**: Asegúrate de que el servidor React esté ejecutándose en el puerto 5174
2. **Tests fallan**: Verifica que el login funcione con las credenciales: `testuser` / `testpass`
3. **Timeouts**: Los tests incluyen waits apropiados, pero si hay problemas de rendimiento, aumenta los timeouts

### Debug

Para debuggear un test específico:

```bash
npx playwright test afiliados-principales.spec.ts --debug
```

Esto abrirá el navegador en modo debug donde puedes ejecutar paso a paso.

## Mejoras Futuras

- [ ] Tests de edición de afiliados
- [ ] Tests de eliminación/desactivación
- [ ] Tests de validaciones específicas (email, DNI, etc.)
- [ ] Tests de búsqueda y filtrado avanzado
- [ ] Tests de responsividad
- [ ] Integración con CI/CD
