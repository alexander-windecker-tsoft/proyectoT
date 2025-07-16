import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Verificar credenciales y establecer el rol del usuario
    if (username === 'admin' && password === 'admin123') {
      // Guardar información del usuario en localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        username: 'admin',
        role: 'admin',
        permissions: ['read', 'write', 'edit', 'delete']
      }));
      navigate('/dashboard');
    } else if (username === 'inspector' && password === 'inspector123') {
      // Usuario inspector con permisos completos como admin
      localStorage.setItem('currentUser', JSON.stringify({
        username: 'inspector',
        role: 'inspector',
        permissions: ['read', 'write', 'edit', 'delete']
      }));
      navigate('/dashboard');
    } else if (username === 'facturacion' && password === 'factura123') {
      // Usuario de facturación con permisos de solo lectura
      localStorage.setItem('currentUser', JSON.stringify({
        username: 'facturacion',
        role: 'facturacion',
        permissions: ['read']
      }));
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
