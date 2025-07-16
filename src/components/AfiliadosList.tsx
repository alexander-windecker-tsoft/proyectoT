import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import databaseService, { type Afiliado } from '../services/databaseService';
import { useAuth } from '../hooks/useAuth';
import './AfiliadosList.css';

const AfiliadosList: React.FC = () => {
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Inicializar base de datos y cargar afiliados
  useEffect(() => {
    const initializeAndLoadData = async () => {
      try {
        await databaseService.initialize();
        const afiliadosFromDB = await databaseService.getAllAfiliados();
        setAfiliados(afiliadosFromDB);
      } catch (error) {
        console.error('Error cargando afiliados:', error);
      }
    };

    initializeAndLoadData();
  }, []);

  const handleCrearAfiliado = () => {
    navigate('/afiliados/nuevo');
  };

  const handleEditarAfiliado = (id: number | undefined) => {
    if (id === undefined) return;
    navigate(`/afiliados/editar/${id}`);
  };

  const handleToggleEstado = async (id: number | undefined) => {
    if (id === undefined) return;
    
    try {
      const afiliado = afiliados.find(a => a.id === id);
      if (afiliado) {
        const nuevoEstado = afiliado.estado === 'activo' ? 'inactivo' : 'activo';
        await databaseService.updateAfiliado(id, { ...afiliado, estado: nuevoEstado });
        const afiliadosActualizados = await databaseService.getAllAfiliados();
        setAfiliados(afiliadosActualizados);
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const afiliadosFiltrados = afiliados.filter(afiliado => {
    const matchesFiltro = filtro === 'todos' || afiliado.estado === filtro;
    const matchesBusqueda = 
      afiliado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      afiliado.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      afiliado.dni.includes(busqueda);
    
    return matchesFiltro && matchesBusqueda;
  });

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Header />
      <div className="afiliados-list-container">
        <div className="afiliados-list-content">
          <div className="afiliados-list-header">
            <h1>🏊‍♂️ Gestión de Afiliados</h1>
            <p>Club de Natación AquaLife</p>
          </div>

          <div className="afiliados-actions">
            <div className="actions-left">
              <button onClick={handleBack} className="back-button">
                ← Volver al Dashboard
              </button>
            </div>
          </div>

          <div className="afiliados-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="filter-select"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Solo activos</option>
                <option value="inactivo">Solo inactivos</option>
              </select>
            </div>
            <div className="filter-group">
              {canEdit() && (
                <button onClick={handleCrearAfiliado} className="create-button">
                  + Crear Afiliado
                </button>
              )}
              {!canEdit() && (
                <div className="read-only-info" style={{
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#856404',
                  fontSize: '14px'
                }}>
                  📋 Modo Solo Lectura
                </div>
              )}
            </div>
          </div>

          <div className="afiliados-table-container">
            <table className="afiliados-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>DNI</th>
                  <th>Clases/Semana</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {afiliadosFiltrados.length > 0 ? (
                  afiliadosFiltrados.map((afiliado) => (
                    <tr key={afiliado.id}>
                      <td>{afiliado.nombre}</td>
                      <td>{afiliado.apellidos}</td>
                      <td>{afiliado.dni}</td>
                      <td>{afiliado.clasesPorSemana} clases</td>
                      <td>{afiliado.telefono}</td>
                      <td>
                        <span className={`estado-badge ${afiliado.estado}`}>
                          {afiliado.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="acciones">
                          {canEdit() && (
                            <>
                              <button
                                onClick={() => handleEditarAfiliado(afiliado.id)}
                                className="edit-button"
                                title="Editar afiliado"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleToggleEstado(afiliado.id)}
                                className={`toggle-button ${afiliado.estado}`}
                                title={afiliado.estado === 'activo' ? 'Desactivar' : 'Activar'}
                              >
                                {afiliado.estado === 'activo' ? '🔒' : '🔓'}
                              </button>
                            </>
                          )}
                          {!canEdit() && (
                            <span className="read-only-badge" title="Solo lectura">
                              👀 Ver
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="no-data">
                      {busqueda || filtro !== 'todos' 
                        ? 'No se encontraron afiliados con los filtros aplicados' 
                        : 'No hay afiliados registrados. ¡Crea el primero!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="afiliados-stats">
            <div className="stat-card">
              <span className="stat-number">{afiliados.filter(a => a.estado === 'activo').length}</span>
              <span className="stat-label">Afiliados Activos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{afiliados.filter(a => a.estado === 'inactivo').length}</span>
              <span className="stat-label">Afiliados Inactivos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{afiliados.length}</span>
              <span className="stat-label">Total Afiliados</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AfiliadosList;
