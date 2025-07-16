import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const Header: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // Referencias para detectar clicks fuera de los dropdowns
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cerrar dropdown de perfil si se hace click fuera
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      
      // Cerrar dropdown de menú si se hace click fuera
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    // Agregar event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup del event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowMenu(false); // Cerrar el otro dropdown
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setShowProfile(false); // Cerrar el otro dropdown
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuClick = (menuItem: string) => {
    console.log(`Navegando a: ${menuItem}`);
    setShowMenu(false);
    
    // Navegación específica para cada menú
    switch (menuItem) {
      case 'Afiliados':
        navigate('/afiliados');
        break;
      case 'Pagos':
        // navigate('/pagos');
        console.log('Navegando a Pagos (próximamente)');
        break;
      case 'Eventos':
        // navigate('/eventos');
        console.log('Navegando a Eventos (próximamente)');
        break;
      case 'Calendario':
        // navigate('/calendario');
        console.log('Navegando a Calendario (próximamente)');
        break;
      default:
        console.log(`Opción ${menuItem} no implementada`);
    }
  };

  const handleConfigClick = () => {
    console.log('Navegando a Configuraciones');
    setShowProfile(false);
    // Aquí puedes agregar la lógica de navegación para configuraciones
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <header className="dashboard-header">
      <div className="left-section">
        <h1 onClick={handleDashboardClick} style={{ cursor: 'pointer' }}>✨ Dashboard</h1>
        <div className="menu-section" ref={menuRef}>
          <button onClick={toggleMenu} className="menu-button">
            📋 Menú
          </button>
          {showMenu && (
            <div className={`menu-dropdown ${showMenu ? 'show' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('Afiliados')}>
                👥 Afiliados
              </div>
              <div className="menu-item" onClick={() => handleMenuClick('Pagos')}>
                💳 Pagos
              </div>
              <div className="menu-item" onClick={() => handleMenuClick('Eventos')}>
                🎉 Eventos
              </div>
              <div className="menu-item" onClick={() => handleMenuClick('Calendario')}>
                📅 Calendario
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="profile-section" ref={profileRef}>
        <button onClick={toggleProfile} className="profile-button">
          👤 Perfil
        </button>
        {showProfile && (
          <div className={`profile-dropdown ${showProfile ? 'show' : ''}`}>
            <div className="profile-info">
              <p><strong>Usuario:</strong> {currentUser?.username || 'Usuario'}</p>
              <p><strong>Rol:</strong> {
                currentUser?.role === 'admin' ? 'Administrador' : 
                currentUser?.role === 'inspector' ? 'Inspector' : 
                'Facturación'
              }</p>
            </div>
            <button onClick={handleConfigClick} className="config-button">
              ⚙️ Configuraciones
            </button>
            <button onClick={handleLogout} className="logout-button">
              🚪 Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
