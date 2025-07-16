import React from 'react';
import Header from './Header';
import './Dashboard.css';

const Dashboard: React.FC = () => {
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
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#333',
              fontSize: '28px',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              🎉 ¡Bienvenido al Dashboard!
            </h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              Has iniciado sesión exitosamente. Aquí puedes gestionar tu perfil y acceder a todas las funcionalidades.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
