// Datos de prueba para los tests de afiliados
export const TestData = {
  // Usuarios de prueba
  validUser: {
    username: 'admin',
    password: 'admin123'
  },

  // Datos de afiliados para pruebas
  afiliadoCompleto: {
    obligatorios: {
      nombre: 'Carlos Eduardo',
      apellidos: 'Martínez Silva',
      dni: '11223344',
      calle: 'Av. Libertador',
      numero: '1500',
      pais: 'argentina',
      provincia: 'Buenos Aires',
      localidad: 'San Isidro',
      codigoPostal: '1642',
      sexo: 'masculino',
      clasesPorSemana: '4',
      tipoClase: 'profesor'
    },
    opcionales: {
      telefono: '+54 11 4567-8901',
      email: 'carlos.martinez@email.com',
      fechaNacimiento: '1985-03-20',
      experienciaNatacion: 'avanzado',
      observaciones: 'Nadador experimentado, participó en competencias locales.'
    }
  },

  afiliadoMinimo: {
    nombre: 'Ana',
    apellidos: 'López',
    dni: '55667788',
    calle: 'Rivadavia',
    numero: '2500',
    pais: 'argentina',
    provincia: 'CABA',
    localidad: 'Balvanera',
    codigoPostal: '1200',
    sexo: 'femenino',
    clasesPorSemana: '2',
    tipoClase: 'profesor'
  },

  afiliadoParaEdicion: {
    nombre: 'Roberto',
    apellidos: 'González',
    dni: '99887766',
    calle: 'Belgrano',
    numero: '800',
    pais: 'argentina',
    provincia: 'Mendoza',
    localidad: 'Mendoza Capital',
    codigoPostal: '5500',
    sexo: 'masculino',
    clasesPorSemana: '3',
    tipoClase: 'profesor'
  },

  // Datos inválidos para pruebas negativas
  datosInvalidos: {
    emailInvalido: 'email-sin-formato-correcto',
    dniCorto: '123',
    nombreVacio: '',
    numeroNegativo: '-1'
  },

  // Términos de búsqueda
  busquedas: {
    porNombre: 'Juan',
    porApellido: 'García',
    porDni: '12345',
    sinResultados: 'XYZ123NoExiste'
  }
};

// Helper functions para los tests
export const TestHelpers = {
  // Generar datos únicos para evitar conflictos
  generateUniqueAfiliado: () => {
    const timestamp = Date.now();
    return {
      nombre: `Test${timestamp}`,
      apellidos: `Apellido${timestamp}`,
      dni: `${timestamp}`.slice(-8),
      calle: 'Calle Test',
      numero: '123',
      pais: 'argentina',
      provincia: 'Test',
      localidad: 'Test City',
      codigoPostal: '1234',
      sexo: 'masculino',
      clasesPorSemana: '2',
      tipoClase: 'profesor'
    };
  },

  // Limpiar localStorage antes de tests
  clearLocalStorage: async (page: any) => {
    await page.evaluate(() => {
      localStorage.clear();
    });
  },

  // Establecer datos iniciales en localStorage
  setupInitialData: async (page: any, afiliados: any[] = []) => {
    await page.evaluate((data) => {
      localStorage.setItem('afiliados', JSON.stringify(data));
    }, afiliados);
  },

  // Verificar datos en localStorage
  getLocalStorageData: async (page: any) => {
    return await page.evaluate(() => {
      const data = localStorage.getItem('afiliados');
      return data ? JSON.parse(data) : [];
    });
  }
};
