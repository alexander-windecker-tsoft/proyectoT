// Ejemplo de uso de los datos de test desde JSON
import { TestData, TestHelpers } from '../test-data/afiliadosTestData';

// Ejemplo 1: Usar datos predefinidos del JSON
const afiliadoMinimo = TestData.afiliadoMinimo;
console.log('Afiliado mínimo:', afiliadoMinimo);

// Ejemplo 2: Generar datos únicos usando templates
const afiliadoUnico = TestHelpers.generateUniqueAfiliado('basico');
console.log('Afiliado único básico:', afiliadoUnico);

const afiliadoCompletoUnico = TestHelpers.generateUniqueAfiliado('completo');
console.log('Afiliado único completo:', afiliadoCompletoUnico);

// Ejemplo 3: Usar template personalizado
const templatePersonalizado = {
  nombre: 'Usuario{TIMESTAMP}',
  apellidos: 'Test',
  dni: '{TIMESTAMP_8}',
  email: 'test{TIMESTAMP}@domain.com'
};

const afiliadoPersonalizado = TestHelpers.generateFromTemplate(templatePersonalizado);
console.log('Afiliado personalizado:', afiliadoPersonalizado);

// Ejemplo 4: Obtener opciones válidas para selects
const opcionesSexo = TestHelpers.getValidOptions('sexos');
console.log('Opciones de sexo:', opcionesSexo);

const opcionesClases = TestHelpers.getValidOptions('clasesPorSemana');
console.log('Opciones de clases por semana:', opcionesClases);

// Ejemplo 5: Usar datos específicos del JSON
const datosInvalidos = TestData.datosInvalidos;
console.log('Datos inválidos para pruebas:', datosInvalidos);

const terminos = TestData.busquedas;
console.log('Términos de búsqueda:', terminos);
