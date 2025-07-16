# 🏊‍♂️ Club de Natación AquaLife - Sistema de Gestión

Sistema completo de gestión de afiliados para Club de Natación AquaLife desarrollado con React, TypeScript y Vite.

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.0-purple?logo=vite)](https://vitejs.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.48.0-green?logo=playwright)](https://playwright.dev/)

## ✨ Características Principales

- **🔐 Sistema de Autenticación Multi-Usuario** con roles y permisos granulares
- **👥 Gestión Completa de Afiliados** (Create, Read, Update, Delete)
- **💾 Base de Datos Local** SQLite con persistencia en navegador
- **🎨 Interfaz Moderna** y completamente responsive
- **🧪 Testing Automatizado** con Playwright usando Page Object Model
- **🛡️ Control de Acceso** basado en roles con diferentes niveles de permisos

## 👤 Usuarios del Sistema

### 🔑 Credenciales de Acceso

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| `admin` | `admin123` | Administrador | ✅ Crear, ✅ Leer, ✅ Editar, ✅ Eliminar |
| `inspector` | `inspector123` | Inspector | ✅ Crear, ✅ Leer, ✅ Editar, ✅ Eliminar |
| `facturacion` | `factura123` | Facturación | ❌ Crear, ✅ Leer, ❌ Editar, ❌ Eliminar |

## 🚀 Tecnologías Utilizadas

### Frontend

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **React Router DOM** - Navegación y ruteo
- **CSS Modules** - Estilos encapsulados

### Base de Datos

- **SQLite** - Base de datos relacional ligera
- **sql.js** - SQLite compilado a WebAssembly
- **localStorage** - Persistencia en navegador

### Testing

- **Playwright** - Framework de testing end-to-end
- **Page Object Model** - Patrón de diseño para tests mantenibles

### Desarrollo

- **Vite** - Build tool y dev server ultra-rápido
- **ESLint** - Linter para mantener calidad del código

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 16 o superior
- npm o yarn

### 🔧 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/alexander-windecker-tsoft/proyectoT.git
   cd proyectoT
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Instalar navegadores para testing**

   ```bash
   npx playwright install
   ```

4. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**

   ```
   http://localhost:5173
   ```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Solo tests de autenticación
npx playwright test tests/login.spec.ts

# Solo tests de gestión de afiliados
npx playwright test tests/afiliados-gestion.spec.ts

# Tests en modo UI interactivo
npx playwright test --ui
```

### Ver Reportes

```bash
# Abrir último reporte
npx playwright show-report
```

## 📁 Estructura del Proyecto

```
📦 react-ts-login/
├── 📂 src/
│   ├── 📂 components/          # Componentes React
│   │   ├── 📄 AfiliadosForm.tsx   # Formulario CRUD afiliados
│   │   ├── 📄 AfiliadosList.tsx   # Lista y gestión afiliados
│   │   ├── 📄 Dashboard.tsx       # Panel principal
│   │   ├── 📄 Header.tsx          # Barra de navegación
│   │   ├── 📄 Login.tsx           # Autenticación
│   │   └── 📄 Snackbar.tsx        # Notificaciones
│   ├── 📂 hooks/               # React Hooks personalizados
│   │   └── 📄 useAuth.ts          # Hook de autenticación
│   ├── 📂 services/            # Lógica de negocio
│   │   └── 📄 databaseService.ts  # Servicio de base de datos
│   └── 📂 assets/             # Recursos estáticos
├── 📂 tests/                  # Suite de testing
│   ├── 📂 pages/              # Page Object Model
│   │   ├── 📄 loginPage.ts        # POM Login
│   │   ├── 📄 afiliadosFormPage.ts # POM Formulario
│   │   └── 📄 afiliadosListPage.ts # POM Lista
│   ├── 📄 login.spec.ts           # Tests autenticación
│   └── 📄 afiliados-gestion.spec.ts # Tests CRUD
├── 📄 package.json            # Dependencias y scripts
├── 📄 playwright.config.ts    # Configuración testing
├── 📄 vite.config.ts         # Configuración Vite
└── 📄 README.md              # Este archivo
```

## 🎯 Funcionalidades Detalladas

### 🔐 Sistema de Autenticación

- Login multi-usuario con validación de credenciales
- Persistencia de sesión en localStorage
- Control granular de permisos por rol
- Logout seguro con limpieza de sesión

### 👥 Gestión de Afiliados

#### ✅ Crear Afiliados

- Formulario completo con validaciones en tiempo real
- Campos obligatorios y opcionales
- Validación de DNI único
- Validación de formato de email

#### 📋 Visualizar Afiliados

- Lista paginada y ordenable
- Búsqueda por nombre, apellido o DNI
- Filtrado por estado (activo/inactivo)
- Vista responsive para móviles

#### ✏️ Editar Afiliados

- Formulario pre-poblado con datos existentes
- Validaciones de integridad de datos
- Confirmación de cambios

#### 🗑️ Eliminar Afiliados

- Confirmación antes de eliminar
- Eliminación lógica (soft delete)

### 🛡️ Control de Acceso

#### Administrador/Inspector

- ✅ Acceso completo a todas las funciones
- ✅ Crear, editar y eliminar afiliados
- ✅ Ver estadísticas y reportes

#### Facturación

- ✅ Visualización de datos de afiliados
- ❌ Campos en modo solo lectura
- ❌ Botones de acción deshabilitados
- ℹ️ Mensajes informativos sobre restricciones

## 📊 Cobertura de Testing

### ✅ Tests Implementados

#### Autenticación (`login.spec.ts`)

- ✅ Renderizado del formulario de login
- ✅ Login exitoso como administrador
- ✅ Login exitoso como inspector  
- ✅ Login exitoso como facturación
- ✅ Manejo de credenciales inválidas
- ✅ Verificación de roles en perfil

#### Gestión de Afiliados (`afiliados-gestion.spec.ts`)

- ✅ Validación de botón guardar
- ✅ Campos obligatorios
- ✅ Funcionalidades de lista
- ✅ Búsqueda y filtrado
- ✅ Permisos por rol

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build para producción
npm run preview         # Preview del build

# Testing
npm run test            # Ejecutar todos los tests
npm run test:headed     # Tests con interfaz gráfica

# Calidad de Código
npm run lint            # Verificar código con ESLint
```

## 🌐 Demo

Puedes acceder a una demo en vivo del proyecto en:
**[https://aqualife-demo.vercel.app](http://localhost:5173)**

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Alexander Windecker** - *TSoft Global*

- GitHub: [@alexander-windecker-tsoft](https://github.com/alexander-windecker-tsoft)
- Email: <alexander.windecker@tsoftglobal.com>

## 🙏 Agradecimientos

- Equipo de TSoft Global por el apoyo en el desarrollo
- Comunidad de React y TypeScript por las herramientas increíbles
- Microsoft Playwright por el framework de testing robusto

---

<div align="center">

**🏊‍♂️ Club de Natación AquaLife**  
*"Donde cada brazada cuenta en la gestión digital"*

⭐ ¡Dale una estrella si te gusta el proyecto! ⭐

</div>
