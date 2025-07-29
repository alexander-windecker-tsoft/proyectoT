import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Snackbar from './Snackbar';
import databaseService from '../services/databaseService';
import { useAuth } from '../hooks/useAuth';
import './AfiliadosForm.css';

interface FormData {
  nombre: string;
  apellidos: string;
  dni: string;
  calle: string;
  numero: string;
  pais: string;
  provincia: string;
  localidad: string;
  codigoPostal: string;
  sexo: string;
  clasesPorSemana: string;
  tipoClase: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  experienciaNatacion: string;
  observaciones: string;
}

interface FormErrors {
  [key: string]: string;
}

const AfiliadosForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellidos: '',
    dni: '',
    calle: '',
    numero: '',
    pais: '',
    provincia: '',
    localidad: '',
    codigoPostal: '',
    sexo: '',
    clasesPorSemana: '',
    tipoClase: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    experienciaNatacion: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Hook de autenticación para verificar permisos
  const { canEdit } = useAuth();

  // Inicializar base de datos
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await databaseService.initialize();
      } catch (error) {
        console.error('Error inicializando base de datos:', error);
        setSnackbar({
          isVisible: true,
          message: 'Error inicializando base de datos',
          type: 'error'
        });
      }
    };
    
    initDatabase();
  }, []);

  // Cargar datos del afiliado si estamos editando
  useEffect(() => {
    const loadAfiliadoData = async () => {
      if (isEditing && id) {
        try {
          const afiliado = await databaseService.getAfiliadoById(parseInt(id));
          
          if (afiliado) {
            setFormData({
              nombre: afiliado.nombre,
              apellidos: afiliado.apellidos,
              dni: afiliado.dni,
              fechaNacimiento: afiliado.fechaNacimiento || '',
              sexo: afiliado.sexo,
              telefono: afiliado.telefono || '',
              email: afiliado.email || '',
              pais: afiliado.pais,
              provincia: afiliado.provincia,
              localidad: afiliado.localidad,
              calle: afiliado.calle,
              numero: afiliado.numero,
              codigoPostal: afiliado.codigoPostal,
              clasesPorSemana: afiliado.clasesPorSemana,
              tipoClase: afiliado.tipoClase,
              experienciaNatacion: afiliado.experienciaNatacion || '',
              observaciones: afiliado.observaciones || ''
            });
          }
        } catch (error) {
          console.error('Error cargando afiliado:', error);
          setSnackbar({
            isVisible: true,
            message: 'Error cargando datos del afiliado',
            type: 'error'
          });
        }
      }
    };

    loadAfiliadoData();
  }, [isEditing, id]);

  const requiredFields = [
    'nombre', 'apellidos', 'dni', 'calle', 'numero', 'pais', 'provincia',
    'localidad', 'codigoPostal', 'sexo', 'clasesPorSemana', 'tipoClase'
  ];

  // Función para verificar si todos los campos obligatorios están completos
  const areRequiredFieldsComplete = (): boolean => {
    return requiredFields.every(field => 
      formData[field as keyof FormData].trim() !== ''
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // Si el usuario no puede editar, no procesar cambios
    if (!canEdit()) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error si el campo se completa
    if (errors[name] && value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejador para cuando un campo pierde el foco
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // Si el usuario no puede editar, no procesar validaciones
    if (!canEdit()) return;
    
    const { name, value } = e.target;
    
    // Verificar si el campo es obligatorio y está vacío
    if (requiredFields.includes(name) && !value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Campo obligatorio'
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData].trim()) {
        newErrors[field] = 'Campo obligatorio';
      }
    });

    // Validaciones específicas
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.dni && formData.dni.length < 7) {
      newErrors.dni = 'DNI debe tener al menos 7 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isEditing && id) {
        // Actualizar afiliado existente en la base de datos
        const success = await databaseService.updateAfiliado(parseInt(id), {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          dni: formData.dni,
          fechaNacimiento: formData.fechaNacimiento,
          sexo: formData.sexo,
          telefono: formData.telefono,
          email: formData.email,
          pais: formData.pais,
          provincia: formData.provincia,
          localidad: formData.localidad,
          calle: formData.calle,
          numero: formData.numero,
          codigoPostal: formData.codigoPostal,
          clasesPorSemana: formData.clasesPorSemana,
          tipoClase: formData.tipoClase,
          experienciaNatacion: formData.experienciaNatacion,
          observaciones: formData.observaciones
        });

        if (success) {
          // Mostrar snackbar de éxito para edición
          setSnackbar({
            isVisible: true,
            message: 'Todo salió bien!!',
            type: 'success'
          });

          // Redirigir después de 3 segundos
          setTimeout(() => {
            navigate('/afiliados');
          }, 3000);
        } else {
          throw new Error('No se pudo actualizar el afiliado');
        }
      } else {
        // Crear nuevo afiliado en la base de datos
        const newId = await databaseService.createAfiliado({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          dni: formData.dni,
          fechaNacimiento: formData.fechaNacimiento,
          sexo: formData.sexo,
          telefono: formData.telefono,
          email: formData.email,
          pais: formData.pais,
          provincia: formData.provincia,
          localidad: formData.localidad,
          calle: formData.calle,
          numero: formData.numero,
          codigoPostal: formData.codigoPostal,
          clasesPorSemana: formData.clasesPorSemana,
          tipoClase: formData.tipoClase,
          experienciaNatacion: formData.experienciaNatacion,
          observaciones: formData.observaciones,
          estado: 'activo'
        });
        
        if (newId) {
          // Mostrar snackbar de éxito
          setSnackbar({
            isVisible: true,
            message: 'Todo salió bien!!',
            type: 'success'
          });

          // Redirigir después de 3 segundos
          setTimeout(() => {
            navigate('/afiliados');
          }, 3000);
        } else {
          throw new Error('No se pudo crear el afiliado');
        }
      }
      
      console.log('Datos del afiliado guardados en la base de datos:', formData);
      
    } catch (error: unknown) {
      console.error('Error al guardar afiliado:', error);
      
      let errorMessage = 'Error al guardar datos. Intente nuevamente.';
      
      // Mostrar mensajes de error más específicos
      if (error instanceof Error && error.message) {
        if (error.message.includes('Ya existe un afiliado con ese DNI')) {
          errorMessage = 'Ya existe un afiliado registrado con ese DNI';
        } else if (error.message.includes('Ya existe un afiliado con ese email')) {
          errorMessage = 'Ya existe un afiliado registrado con ese email';
        } else if (error.message.includes('Ya existe un afiliado con esos datos')) {
          errorMessage = 'Ya existe un afiliado registrado con esos datos';
        }
      }
      
      setSnackbar({
        isVisible: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/afiliados');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <Header />
      <div className="afiliados-container">
        <div className="afiliados-content">
          <div className="afiliados-header">
            <h1>🏊‍♂️ {isEditing ? 'Editar Afiliado' : 'Registro de Nuevo Afiliado'}</h1>
            <p>Club de Natación AquaLife</p>
            {!canEdit() && (
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '10px',
                margin: '10px 0',
                color: '#856404'
              }}>
                📋 <strong>Modo Solo Lectura:</strong> Puedes consultar la información pero no realizar modificaciones.
              </div>
            )}
          </div>

      <form onSubmit={handleSubmit} className={`afiliados-form ${!canEdit() ? 'readonly-mode' : ''}`}>
        <div className="form-section">
          <h2>📋 Datos Personales</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.nombre ? 'error' : ''}
                placeholder="Ingrese el nombre"
                readOnly={!canEdit()}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">Apellidos *</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.apellidos ? 'error' : ''}
                placeholder="Ingrese los apellidos"
                readOnly={!canEdit()}
              />
              {errors.apellidos && <span className="error-message">{errors.apellidos}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dni">DNI/Documento *</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.dni ? 'error' : ''}
                placeholder="Número de documento"
              />
              {errors.dni && <span className="error-message">{errors.dni}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sexo">Sexo *</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.sexo ? 'error' : ''}
                disabled={!canEdit()}
              >
                <option value="">Seleccione...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
              {errors.sexo && <span className="error-message">{errors.sexo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="usuario@email.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>🏠 Datos de Domicilio</h2>
          <div className="form-grid domicilio-grid">
            {/* Primera fila: País, Provincia, Localidad */}
            <div className="form-group">
              <label htmlFor="pais">País *</label>
              <select
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.pais ? 'error' : ''}
              >
                <option value="">Seleccione...</option>
                <option value="argentina">Argentina</option>
                <option value="brasil">Brasil</option>
                <option value="chile">Chile</option>
                <option value="uruguay">Uruguay</option>
                <option value="otro">Otro</option>
              </select>
              {errors.pais && <span className="error-message">{errors.pais}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="provincia">Provincia *</label>
              <input
                type="text"
                id="provincia"
                name="provincia"
                value={formData.provincia}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.provincia ? 'error' : ''}
                placeholder="Provincia/Estado"
              />
              {errors.provincia && <span className="error-message">{errors.provincia}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="localidad">Localidad *</label>
              <input
                type="text"
                id="localidad"
                name="localidad"
                value={formData.localidad}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.localidad ? 'error' : ''}
                placeholder="Ciudad/Localidad"
              />
              {errors.localidad && <span className="error-message">{errors.localidad}</span>}
            </div>

            {/* Segunda fila: Calle, Número, Código Postal */}
            <div className="form-group">
              <label htmlFor="calle">Calle *</label>
              <input
                type="text"
                id="calle"
                name="calle"
                value={formData.calle}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.calle ? 'error' : ''}
                placeholder="Nombre de la calle"
              />
              {errors.calle && <span className="error-message">{errors.calle}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="numero">Número *</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.numero ? 'error' : ''}
                placeholder="Nro. de casa/apto"
              />
              {errors.numero && <span className="error-message">{errors.numero}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="codigoPostal">Código Postal *</label>
              <input
                type="text"
                id="codigoPostal"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.codigoPostal ? 'error' : ''}
                placeholder="1234"
              />
              {errors.codigoPostal && <span className="error-message">{errors.codigoPostal}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>🏊‍♀️ Información de Clases</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="clasesPorSemana">Clases por Semana *</label>
              <select
                id="clasesPorSemana"
                name="clasesPorSemana"
                value={formData.clasesPorSemana}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.clasesPorSemana ? 'error' : ''}
              >
                <option value="">Seleccione...</option>
                <option value="1">1 clase por semana</option>
                <option value="2">2 clases por semana</option>
                <option value="3">3 clases por semana</option>
                <option value="4">4 clases por semana</option>
              </select>
              {errors.clasesPorSemana && <span className="error-message">{errors.clasesPorSemana}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tipoClase">Tipo de Clase *</label>
              <select
                id="tipoClase"
                name="tipoClase"
                value={formData.tipoClase}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={errors.tipoClase ? 'error' : ''}
              >
                <option value="">Seleccione...</option>
                <option value="libre">Clases Libres</option>
                <option value="profesor">Con Profesor</option>
              </select>
              {errors.tipoClase && <span className="error-message">{errors.tipoClase}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="experienciaNatacion">Experiencia en Natación</label>
              <select
                id="experienciaNatacion"
                name="experienciaNatacion"
                value={formData.experienciaNatacion}
                onChange={handleInputChange}
              >
                <option value="">Seleccione...</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="competitivo">Competitivo</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={3}
                placeholder="Información adicional, objetivos, condiciones médicas, etc."
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleBack}
            className="cancel-button"
          >
            Cancelar
          </button>          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting || !areRequiredFieldsComplete() || !canEdit()}
            title={!canEdit() ? 'No tienes permisos para editar' : ''}
          >
            {!canEdit() 
              ? '🔒 Solo Lectura'
              : isSubmitting 
                ? '💾 Guardando...' 
                : isEditing 
                  ? '✅ Actualizar' 
                  : '💾 Guardar'
            }
          </button>
        </div>
      </form>
        </div>
      </div>
      <Snackbar
        message={snackbar.message}
        isVisible={snackbar.isVisible}
        onClose={handleCloseSnackbar}
        type={snackbar.type}
        duration={3000}
      />
    </>
  );
};

export default AfiliadosForm;
