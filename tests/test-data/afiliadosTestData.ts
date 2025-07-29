// Datos de prueba para los tests de afiliados desde JSON
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Page } from '@playwright/test';

// Fix para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar datos desde JSON
function loadTestDataFromJSON() {
  try {
    const dataPath = path.join(__dirname, 'afiliadosTestData.json');
    const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return testData;
  } catch {
    // Fallback a datos básicos
    return {
      validUser: {
        username: 'admin',
        password: 'admin123'
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
      }
    };
  }
}

const jsonData = loadTestDataFromJSON();

// Exportar datos cargados desde JSON
export const TestData = jsonData;

// Helper functions para los tests
export const TestHelpers = {
  // Generar datos únicos desde templates JSON
  generateUniqueAfiliado: (template: 'basico' | 'completo' = 'basico') => {
    const timestamp = Date.now();
    const templateKey = template === 'basico' ? 'afiliadoBasico' : 'afiliadoCompleto';
    const templateData = jsonData.templates[templateKey];
    
    // Reemplazar placeholders en el template
    const processedData: Record<string, unknown> = {};
    
    Object.keys(templateData).forEach(key => {
      let value = templateData[key];
      if (typeof value === 'string') {
        value = value.replace('{TIMESTAMP}', timestamp.toString());
        value = value.replace('{TIMESTAMP_8}', timestamp.toString().slice(-8));
      }
      processedData[key] = value;
    });
    
    return processedData;
  },

  // Generar datos desde template personalizado
  generateFromTemplate: (customTemplate: Record<string, unknown>) => {
    const timestamp = Date.now();
    const processedData: Record<string, unknown> = {};
    
    Object.keys(customTemplate).forEach(key => {
      let value = customTemplate[key];
      if (typeof value === 'string') {
        value = value.replace('{TIMESTAMP}', timestamp.toString());
        value = value.replace('{TIMESTAMP_8}', timestamp.toString().slice(-8));
        processedData[key] = value;
      } else {
        processedData[key] = value;
      }
    });
    
    return processedData;
  },

  // Obtener opciones válidas para selects
  getValidOptions: (field: string) => {
    return jsonData.selectors[field] || {};
  },

  // Limpiar localStorage antes de tests
  clearLocalStorage: async (page: Page) => {
    await page.evaluate(() => {
      localStorage.clear();
    });
  },

  // Establecer datos iniciales en localStorage
  setupInitialData: async (page: Page, afiliados: unknown[] = []) => {
    await page.evaluate((data) => {
      localStorage.setItem('afiliados', JSON.stringify(data));
    }, afiliados);
  },

  // Verificar datos en localStorage
  getLocalStorageData: async (page: Page) => {
    return await page.evaluate(() => {
      const data = localStorage.getItem('afiliados');
      return data ? JSON.parse(data) : [];
    });
  },

  // Crear afiliado con datos específicos del JSON
  createAfiliadoFromData: (dataKey: string) => {
    return jsonData[dataKey] || null;
  }
};
