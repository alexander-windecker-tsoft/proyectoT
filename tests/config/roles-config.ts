// Configuración centralizada de roles desde JSON
// Para modificar roles, edita el archivo roles.json

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Fix para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RoleConfig {
  username: string;
  password: string;
  roleName: string;
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
  };
  expectedBehavior: {
    formFieldsReadonly: boolean;
    hasCreateButton: boolean;
    hasEditButtons: boolean;
    hasDeleteButtons: boolean;
  };
  description?: string;
}

// Cargar roles desde JSON
function loadRolesFromJSON() {
  try {
    const configPath = path.join(__dirname, 'roles.json');
    const rolesData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return rolesData;
  } catch {
    // Fallback a configuración por defecto
    return {
      currentRoles: [
        {
          username: 'admin',
          password: 'admin123',
          roleName: 'Administrador',
          description: 'Acceso completo al sistema',
          permissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canView: true
          },
          expectedBehavior: {
            formFieldsReadonly: false,
            hasCreateButton: true,
            hasEditButtons: true,
            hasDeleteButtons: true
          }
        },
        {
          username: 'inspector',
          password: 'inspector123',
          roleName: 'Inspector',
          description: 'Acceso completo para inspección y gestión',
          permissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canView: true
          },
          expectedBehavior: {
            formFieldsReadonly: false,
            hasCreateButton: true,
            hasEditButtons: true,
            hasDeleteButtons: true
          }
        },
        {
          username: 'facturacion',
          password: 'factura123',
          roleName: 'Facturación',
          description: 'Solo lectura para consultas de facturación',
          permissions: {
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canView: true
          },
          expectedBehavior: {
            formFieldsReadonly: true,
            hasCreateButton: false,
            hasEditButtons: false,
            hasDeleteButtons: false
          }
        }
      ],
      futureRoles: []
    };
  }
}

const rolesData = loadRolesFromJSON();

export const CURRENT_ROLES: RoleConfig[] = rolesData.currentRoles;
export const FUTURE_ROLES: RoleConfig[] = rolesData.futureRoles;

// Helper functions
export function getAllRoles(): RoleConfig[] {
  return CURRENT_ROLES;
}

export function getRolesWithPermission(permission: keyof RoleConfig['permissions']): RoleConfig[] {
  return CURRENT_ROLES.filter(role => role.permissions[permission]);
}

export function getRoleByUsername(username: string): RoleConfig | undefined {
  return CURRENT_ROLES.find(role => role.username === username);
}

export function activateRole(roleName: string): boolean {
  const roleIndex = FUTURE_ROLES.findIndex(role => role.roleName === roleName);
  if (roleIndex !== -1) {
    const role = FUTURE_ROLES.splice(roleIndex, 1)[0];
    CURRENT_ROLES.push(role);
    return true;
  }
  return false;
}
