import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class AfiliadosFormPage {
    readonly page: Page;
    
    // Campos obligatorios
    readonly nombreInput: Locator;
    readonly apellidosInput: Locator;
    readonly dniInput: Locator;
    readonly calleInput: Locator;
    readonly numeroInput: Locator;
    readonly paisInput: Locator;
    readonly provinciaInput: Locator;
    readonly localidadInput: Locator;
    readonly codigoPostalInput: Locator;
    readonly sexoSelect: Locator;
    readonly clasesPorSemanaSelect: Locator;
    readonly tipoClaseSelect: Locator;
    
    // Campos opcionales
    readonly telefonoInput: Locator;
    readonly emailInput: Locator;
    readonly fechaNacimientoInput: Locator;
    readonly experienciaNatacionSelect: Locator;
    readonly observacionesTextarea: Locator;
    
    // Botones
    readonly guardarButton: Locator;
    readonly cancelarButton: Locator;
    
    // Elementos de validación
    readonly headerTitle: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Campos obligatorios
        this.nombreInput = page.locator('input[name="nombre"]');
        this.apellidosInput = page.locator('input[name="apellidos"]');
        this.dniInput = page.locator('input[name="dni"]');
        this.calleInput = page.locator('input[name="calle"]');
        this.numeroInput = page.locator('input[name="numero"]');
        this.paisInput = page.locator('select[name="pais"]');
        this.provinciaInput = page.locator('input[name="provincia"]');
        this.localidadInput = page.locator('input[name="localidad"]');
        this.codigoPostalInput = page.locator('input[name="codigoPostal"]');
        this.sexoSelect = page.locator('select[name="sexo"]');
        this.clasesPorSemanaSelect = page.locator('select[name="clasesPorSemana"]');
        this.tipoClaseSelect = page.locator('select[name="tipoClase"]');
        
        // Campos opcionales
        this.telefonoInput = page.locator('input[name="telefono"]');
        this.emailInput = page.locator('input[name="email"]');
        this.fechaNacimientoInput = page.locator('input[name="fechaNacimiento"]');
        this.experienciaNatacionSelect = page.locator('select[name="experienciaNatacion"]');
        this.observacionesTextarea = page.locator('textarea[name="observaciones"]');
        
        // Botones
        this.guardarButton = page.locator('button[type="submit"]');
        this.cancelarButton = page.locator('button:has-text("Cancelar")');
        
        // Elementos de validación
        this.headerTitle = page.locator('.form-container h1, .page-content h1').last();
        this.successMessage = page.locator('.success-message, .alert-success');
    }

    async navegarAFormularioNuevo() {
        await this.page.goto('/afiliados/nuevo');
        await this.page.waitForURL('/afiliados/nuevo');
        // Verificar que el formulario de afiliados esté visible
        await expect(this.nombreInput).toBeVisible();
    }

    async navegarAFormularioEdicion(id: string) {
        await this.page.goto(`/afiliados/editar/${id}`);
        await expect(this.headerTitle).toContainText('Editar Afiliado');
    }

    async completarCamposObligatorios(datos: {
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
    }) {
        await this.nombreInput.fill(datos.nombre);
        await this.apellidosInput.fill(datos.apellidos);
        await this.dniInput.fill(datos.dni);
        await this.calleInput.fill(datos.calle);
        await this.numeroInput.fill(datos.numero);
        await this.paisInput.selectOption(datos.pais);
        await this.provinciaInput.fill(datos.provincia);
        await this.localidadInput.fill(datos.localidad);
        await this.codigoPostalInput.fill(datos.codigoPostal);
        await this.sexoSelect.selectOption(datos.sexo);
        await this.clasesPorSemanaSelect.selectOption(datos.clasesPorSemana);
        await this.tipoClaseSelect.selectOption(datos.tipoClase);
    }

    async completarCamposOpcionales(datos: {
        telefono?: string;
        email?: string;
        fechaNacimiento?: string;
        experienciaNatacion?: string;
        observaciones?: string;
    }) {
        if (datos.telefono) {
            await this.telefonoInput.fill(datos.telefono);
        }
        if (datos.email) {
            await this.emailInput.fill(datos.email);
        }
        if (datos.fechaNacimiento) {
            await this.fechaNacimientoInput.fill(datos.fechaNacimiento);
        }
        if (datos.experienciaNatacion) {
            await this.experienciaNatacionSelect.selectOption(datos.experienciaNatacion);
        }
        if (datos.observaciones) {
            await this.observacionesTextarea.fill(datos.observaciones);
        }
    }

    async verificarBotonGuardarDeshabilitado() {
        await expect(this.guardarButton).toBeDisabled();
    }

    async verificarBotonGuardarHabilitado() {
        await expect(this.guardarButton).toBeEnabled();
    }

    async guardarAfiliado() {
        await this.guardarButton.click();
    }

    async cancelar() {
        await this.cancelarButton.click();
    }

    async esperarRedirecciona() {
        // Esperar ya sea por la redirección automática o por el snackbar de éxito
        try {
            await this.page.waitForURL('/afiliados', { timeout: 10000 });
        } catch (e) {
            // Si no se redirige automáticamente, verificar si hay snackbar de éxito
            const snackbar = this.page.locator('.snackbar.success, .snackbar-message');
            if (await snackbar.isVisible()) {
                // Si hay éxito pero no redirección, navegar manualmente
                await this.page.goto('/afiliados');
            } else {
                throw e;
            }
        }
    }

    // Método helper para obtener datos de prueba válidos
    getDatosObligatoriosValidos() {
        const timestamp = Date.now();
        return {
            nombre: 'Juan Carlos',
            apellidos: 'García López',
            dni: `${timestamp.toString().slice(-8)}`, // DNI único basado en timestamp
            calle: 'Av. Corrientes',
            numero: '1234',
            pais: 'argentina', // Coincide con el value del option
            provincia: 'Buenos Aires',
            localidad: 'CABA',
            codigoPostal: '1001',
            sexo: 'masculino', // Coincide con el value del option
            clasesPorSemana: '3', // Coincide con el value del option
            tipoClase: 'libre' // Coincide con el value del option (Clases Libres)
        };
    }

    getDatosOpcionalesValidos() {
        return {
            telefono: '+54 11 1234-5678',
            email: `test.${Date.now()}@email.com`, // Email único
            fechaNacimiento: '1990-05-15',
            experienciaNatacion: 'intermedio', // Coincide con el value del option
            observaciones: 'Afiliado con experiencia previa en natación'
        };
    }
}
