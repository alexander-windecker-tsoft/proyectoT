// Configuración centralizada de roles
// Este archivo puede ser modificado fácilmente para agregar nuevos roles

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

export const CURRENT_ROLES: RoleConfig[] = [
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
];

// 🚀 Roles futuros - fácil de activar cuando se implementen
export const FUTURE_ROLES: RoleConfig[] = [
  {
    username: 'supervisor',
    password: 'super123',
    roleName: 'Supervisor',
    description: 'Supervisión con permisos limitados de eliminación',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canView: true
    },
    expectedBehavior: {
      formFieldsReadonly: false,
      hasCreateButton: true,
      hasEditButtons: true,
      hasDeleteButtons: false
    }
  },
  {
    username: 'recepcion',
    password: 'recep123',
    roleName: 'Recepción',
    description: 'Solo creación y visualización de afiliados',
    permissions: {
      canCreate: true,
      canEdit: false,
      canDelete: false,
      canView: true
    },
    expectedBehavior: {
      formFieldsReadonly: false, // Solo para creación
      hasCreateButton: true,
      hasEditButtons: false,
      hasDeleteButtons: false
    }
  },
  {
    username: 'entrenador',
    password: 'coach123',
    roleName: 'Entrenador',
    description: 'Solo visualización de afiliados asignados',
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
];

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

// Para cuando se implementen nuevos roles, simplemente mover de FUTURE_ROLES a CURRENT_ROLES
export function activateRole(roleName: string): boolean {
  const roleIndex = FUTURE_ROLES.findIndex(role => role.roleName === roleName);
  if (roleIndex !== -1) {
    const role = FUTURE_ROLES.splice(roleIndex, 1)[0];
    CURRENT_ROLES.push(role);
    console.log(`✅ Rol "${roleName}" activado para testing`);
    return true;
  }
  return false;
}
