import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isFacturacion } = useAuth();

  const handleGestionAfiliados = () => {
    navigate('/afiliados');
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <main className="dashboard-content">
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              color: '#333',
              fontSize: '28px',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              🎉 ¡Bienvenido {currentUser?.username || 'Usuario'}!
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              Has iniciado sesión exitosamente {isFacturacion() && '(modo solo lectura)'}. Desde aquí puedes acceder a todas las funcionalidades del Club de Natación AquaLife.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div 
              onClick={handleGestionAfiliados}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                padding: '30px',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏊‍♂️</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>
                Gestión de Afiliados
              </h3>
              <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.4' }}>
                Administra afiliados, registra nuevos miembros y gestiona su información
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '15px',
              padding: '30px',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              opacity: '0.7'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📅</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>
                Horarios y Clases
              </h3>
              <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.4' }}>
                Gestiona horarios de clases y asignaciones (Próximamente)
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '15px',
              padding: '30px',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              opacity: '0.7'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>💰</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>
                Pagos y Facturación
              </h3>
              <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.4' }}>
                Control de pagos y emisión de facturas (Próximamente)
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
