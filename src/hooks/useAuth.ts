import { useState, useEffect } from 'react';

export interface User {
  username: string;
  role: 'admin' | 'inspector' | 'facturacion';
  permissions: string[];
}

export const useAuth = () => {
  // Inicializar inmediatamente desde localStorage si existe
  const getInitialUser = (): User | null => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [currentUser, setCurrentUser] = useState<User | null>(getInitialUser);

  useEffect(() => {
    // Cargar usuario desde localStorage al montar el componente
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const hasPermission = (permission: string): boolean => {
    return currentUser?.permissions.includes(permission) || false;
  };

  const canEdit = (): boolean => {
    return hasPermission('write') || hasPermission('edit');
  };

  const canDelete = (): boolean => {
    return hasPermission('delete');
  };

  const canRead = (): boolean => {
    return hasPermission('read');
  };

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  const isInspector = (): boolean => {
    return currentUser?.role === 'inspector';
  };

  const isFacturacion = (): boolean => {
    return currentUser?.role === 'facturacion';
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return {
    currentUser,
    hasPermission,
    canEdit,
    canDelete,
    canRead,
    isAdmin,
    isInspector,
    isFacturacion,
    logout
  };
};
