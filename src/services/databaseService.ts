import initSqlJs, { type Database } from 'sql.js';

export interface Afiliado {
  id?: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento?: string;
  sexo: string;
  telefono?: string;
  email?: string;
  pais: string;
  provincia: string;
  localidad: string;
  calle: string;
  numero: string;
  codigoPostal: string;
  clasesPorSemana: string;
  tipoClase: string;
  experienciaNatacion?: string;
  observaciones?: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

class DatabaseService {
  private db: Database | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Cargar SQL.js
      const SQL = await initSqlJs({
        // Puedes especificar la ruta del wasm si es necesario
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });

      // Intentar cargar base de datos existente desde localStorage
      const savedData = localStorage.getItem('aqualife_database');
      
      if (savedData) {
        // Convertir string base64 a Uint8Array
        const binaryString = atob(savedData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        this.db = new SQL.Database(bytes);
      } else {
        // Crear nueva base de datos
        this.db = new SQL.Database();
        await this.createTables();
        await this.insertSampleData();
      }

      this.isInitialized = true;
      console.log('✅ Base de datos SQLite inicializada correctamente');
    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const createAfiliadosTable = `
      CREATE TABLE IF NOT EXISTS afiliados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        dni TEXT UNIQUE NOT NULL,
        fechaNacimiento TEXT,
        sexo TEXT NOT NULL,
        telefono TEXT,
        email TEXT,
        pais TEXT NOT NULL,
        provincia TEXT NOT NULL,
        localidad TEXT NOT NULL,
        calle TEXT NOT NULL,
        numero TEXT NOT NULL,
        codigoPostal TEXT NOT NULL,
        clasesPorSemana TEXT NOT NULL,
        tipoClase TEXT NOT NULL,
        experienciaNatacion TEXT,
        observaciones TEXT,
        estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
        fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    this.db.run(createAfiliadosTable);
    this.saveToLocalStorage();
  }

  private async insertSampleData(): Promise<void> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const sampleAfiliados = [
      {
        nombre: 'Juan Carlos',
        apellidos: 'Pérez González',
        dni: '12345678',
        fechaNacimiento: '1985-03-15',
        sexo: 'masculino',
        telefono: '+54 11 1234-5678',
        email: 'juan.perez@email.com',
        pais: 'argentina',
        provincia: 'Buenos Aires',
        localidad: 'La Plata',
        calle: 'Avenida 7',
        numero: '1234',
        codigoPostal: '1900',
        clasesPorSemana: '2',
        tipoClase: 'profesor',
        experienciaNatacion: 'intermedio',
        observaciones: 'Miembro fundador del club',
        estado: 'activo' as const
      },
      {
        nombre: 'María Elena',
        apellidos: 'Rodríguez Silva',
        dni: '87654321',
        fechaNacimiento: '1990-07-22',
        sexo: 'femenino',
        telefono: '+54 11 8765-4321',
        email: 'maria.rodriguez@email.com',
        pais: 'argentina',
        provincia: 'Buenos Aires',
        localidad: 'La Plata',
        calle: 'Calle 50',
        numero: '567',
        codigoPostal: '1900',
        clasesPorSemana: '3',
        tipoClase: 'libre',
        experienciaNatacion: 'avanzado',
        observaciones: 'Competidora regional',
        estado: 'activo' as const
      },
      {
        nombre: 'Carlos Alberto',
        apellidos: 'Mendoza López',
        dni: '11223344',
        fechaNacimiento: '1978-12-05',
        sexo: 'masculino',
        telefono: '+54 11 1122-3344',
        email: 'carlos.mendoza@email.com',
        pais: 'argentina',
        provincia: 'Buenos Aires',
        localidad: 'Berisso',
        calle: 'Montevideo',
        numero: '890',
        codigoPostal: '1923',
        clasesPorSemana: '1',
        tipoClase: 'libre',
        experienciaNatacion: 'principiante',
        observaciones: '',
        estado: 'inactivo' as const
      }
    ];

    for (const afiliado of sampleAfiliados) {
      await this.createAfiliado(afiliado);
    }
  }

  private saveToLocalStorage(): void {
    if (!this.db) return;
    
    // Exportar base de datos a Uint8Array
    const data = this.db.export();
    
    // Convertir a string base64 para almacenar en localStorage
    let binaryString = '';
    for (let i = 0; i < data.length; i++) {
      binaryString += String.fromCharCode(data[i]);
    }
    const base64String = btoa(binaryString);
    
    localStorage.setItem('aqualife_database', base64String);
  }

  async getAllAfiliados(): Promise<Afiliado[]> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const stmt = this.db.prepare(`
      SELECT * FROM afiliados 
      ORDER BY fechaCreacion DESC
    `);

    const result: Afiliado[] = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject() as unknown as Afiliado);
    }
    stmt.free();

    return result;
  }

  async getAfiliadoById(id: number): Promise<Afiliado | null> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const stmt = this.db.prepare('SELECT * FROM afiliados WHERE id = ?');
    stmt.bind([id]);

    let afiliado: Afiliado | null = null;
    if (stmt.step()) {
      afiliado = stmt.getAsObject() as unknown as Afiliado;
    }
    stmt.free();

    return afiliado;
  }

  async createAfiliado(afiliado: Omit<Afiliado, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<number> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    try {
      const stmt = this.db.prepare(`
        INSERT INTO afiliados (
          nombre, apellidos, dni, fechaNacimiento, sexo, telefono, email,
          pais, provincia, localidad, calle, numero, codigoPostal,
          clasesPorSemana, tipoClase, experienciaNatacion, observaciones, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        afiliado.nombre,
        afiliado.apellidos,
        afiliado.dni,
        afiliado.fechaNacimiento || null,
        afiliado.sexo,
        afiliado.telefono || null,
        afiliado.email || null,
        afiliado.pais,
        afiliado.provincia,
        afiliado.localidad,
        afiliado.calle,
        afiliado.numero,
        afiliado.codigoPostal,
        afiliado.clasesPorSemana,
        afiliado.tipoClase,
        afiliado.experienciaNatacion || null,
        afiliado.observaciones || null,
        afiliado.estado
      ]);

      const result = this.db.exec('SELECT last_insert_rowid() as id');
      const insertId = result[0].values[0][0] as number;

      stmt.free();
      this.saveToLocalStorage();

      return insertId;
    } catch (error: unknown) {
      // Verificar si es un error de restricción UNIQUE
      if (error instanceof Error && error.message && error.message.includes('UNIQUE constraint failed')) {
        if (error.message.includes('dni')) {
          throw new Error('Ya existe un afiliado con ese DNI');
        } else if (error.message.includes('email')) {
          throw new Error('Ya existe un afiliado con ese email');
        } else {
          throw new Error('Ya existe un afiliado con esos datos');
        }
      }
      
      // Re-lanzar otros errores
      throw error;
    }
  }

  async updateAfiliado(id: number, afiliado: Partial<Afiliado>): Promise<boolean> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const stmt = this.db.prepare(`
      UPDATE afiliados SET 
        nombre = ?, apellidos = ?, dni = ?, fechaNacimiento = ?, sexo = ?,
        telefono = ?, email = ?, pais = ?, provincia = ?, localidad = ?,
        calle = ?, numero = ?, codigoPostal = ?, clasesPorSemana = ?,
        tipoClase = ?, experienciaNatacion = ?, observaciones = ?, estado = ?,
        fechaActualizacion = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const currentAfiliado = await this.getAfiliadoById(id);
    if (!currentAfiliado) return false;

    const updatedAfiliado = { ...currentAfiliado, ...afiliado };

    stmt.run([
      updatedAfiliado.nombre,
      updatedAfiliado.apellidos,
      updatedAfiliado.dni,
      updatedAfiliado.fechaNacimiento || null,
      updatedAfiliado.sexo,
      updatedAfiliado.telefono || null,
      updatedAfiliado.email || null,
      updatedAfiliado.pais,
      updatedAfiliado.provincia,
      updatedAfiliado.localidad,
      updatedAfiliado.calle,
      updatedAfiliado.numero,
      updatedAfiliado.codigoPostal,
      updatedAfiliado.clasesPorSemana,
      updatedAfiliado.tipoClase,
      updatedAfiliado.experienciaNatacion || null,
      updatedAfiliado.observaciones || null,
      updatedAfiliado.estado,
      id
    ]);

    stmt.free();
    this.saveToLocalStorage();

    return true;
  }

  async deleteAfiliado(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const stmt = this.db.prepare('DELETE FROM afiliados WHERE id = ?');
    stmt.run([id]);
    
    const changes = this.db.getRowsModified();
    stmt.free();
    this.saveToLocalStorage();

    return changes > 0;
  }

  async searchAfiliados(searchTerm: string): Promise<Afiliado[]> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const stmt = this.db.prepare(`
      SELECT * FROM afiliados 
      WHERE nombre LIKE ? OR apellidos LIKE ? OR dni LIKE ?
      ORDER BY fechaCreacion DESC
    `);

    const term = `%${searchTerm}%`;
    stmt.bind([term, term, term]);

    const result: Afiliado[] = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject() as unknown as Afiliado);
    }
    stmt.free();

    return result;
  }

  async getAfiliadosByEstado(estado: 'activo' | 'inactivo'): Promise<Afiliado[]> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const stmt = this.db.prepare(`
      SELECT * FROM afiliados 
      WHERE estado = ?
      ORDER BY fechaCreacion DESC
    `);

    stmt.bind([estado]);

    const result: Afiliado[] = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject() as unknown as Afiliado);
    }
    stmt.free();

    return result;
  }

  async toggleAfiliadoEstado(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const afiliado = await this.getAfiliadoById(id);
    if (!afiliado) return false;

    const nuevoEstado = afiliado.estado === 'activo' ? 'inactivo' : 'activo';
    return await this.updateAfiliado(id, { estado: nuevoEstado });
  }

  // Método para limpiar la base de datos (útil para testing)
  async clearDatabase(): Promise<void> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    this.db.run('DELETE FROM afiliados');
    this.saveToLocalStorage();
  }

  // Método para obtener estadísticas
  async getEstadisticas(): Promise<{ total: number; activos: number; inactivos: number }> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const totalResult = this.db.exec('SELECT COUNT(*) as total FROM afiliados');
    const activosResult = this.db.exec("SELECT COUNT(*) as activos FROM afiliados WHERE estado = 'activo'");
    const inactivosResult = this.db.exec("SELECT COUNT(*) as inactivos FROM afiliados WHERE estado = 'inactivo'");

    return {
      total: totalResult[0]?.values[0][0] as number || 0,
      activos: activosResult[0]?.values[0][0] as number || 0,
      inactivos: inactivosResult[0]?.values[0][0] as number || 0
    };
  }
}

// Singleton instance
export const databaseService = new DatabaseService();
export default databaseService;
