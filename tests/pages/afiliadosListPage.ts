import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class AfiliadosListPage {
    readonly page: Page;
    
    // Elementos de la página
    readonly headerTitle: Locator;
    readonly crearNuevoButton: Locator;
    readonly searchInput: Locator;
    readonly filterSelect: Locator;
    readonly afiliadosTable: Locator;
    readonly volverDashboardButton: Locator;
    
    // Estadísticas
    readonly afiliadosActivosCount: Locator;
    readonly afiliadosInactivosCount: Locator;
    readonly totalAfiliadosCount: Locator;
    
    // Elementos dinámicos de la tabla
    readonly tableRows: Locator;
    readonly editButtons: Locator;
    readonly toggleButtons: Locator;
    readonly estadoBadges: Locator;

    constructor(page: Page) {
        this.page = page;
        
        this.headerTitle = page.locator('h1');
        this.crearNuevoButton = page.locator('button:has-text("Crear Afiliado")'); // Texto correcto del botón
        this.searchInput = page.locator('input[placeholder*="Buscar"]');
        this.filterSelect = page.locator('select.filter-select');
        this.afiliadosTable = page.locator('.afiliados-table');
        this.volverDashboardButton = page.locator('button:has-text("Volver al Dashboard")');
        
        // Estadísticas
        this.afiliadosActivosCount = page.locator('.stat-card').filter({ hasText: 'Activos' }).locator('.stat-number');
        this.afiliadosInactivosCount = page.locator('.stat-card').filter({ hasText: 'Inactivos' }).locator('.stat-number');
        this.totalAfiliadosCount = page.locator('.stat-card').filter({ hasText: 'Total' }).locator('.stat-number');
        
        // Elementos dinámicos de la tabla
        this.tableRows = page.locator('.afiliados-table tbody tr');
        this.editButtons = page.locator('.edit-button');
        this.toggleButtons = page.locator('.toggle-button');
        this.estadoBadges = page.locator('.estado-badge');
    }

    async navegarALista() {
        await this.page.goto('/afiliados');
        await this.page.waitForURL('/afiliados');
        // Verificar que la tabla de afiliados esté visible
        await expect(this.afiliadosTable).toBeVisible();
    }

    async irACrearNuevoAfiliado() {
        await this.crearNuevoButton.click();
        await this.page.waitForURL('/afiliados/nuevo');
    }

    async buscarAfiliado(termino: string) {
        await this.searchInput.fill(termino);
        // Esperar a que se actualice la tabla
        await this.page.waitForTimeout(500);
    }

    async filtrarPorEstado(estado: string) {
        await this.filterSelect.selectOption(estado);
        await this.page.waitForTimeout(500);
    }

    async verificarAfiliadoEnLista(nombre: string, apellidos: string, dni: string) {
        // Esperar a que la página cargue completamente
        await this.page.waitForLoadState('networkidle');
        
        // Hacer una búsqueda rápida para forzar la actualización
        await this.searchInput.fill(dni);
        await this.page.waitForTimeout(500);
        await this.searchInput.fill('');
        await this.page.waitForTimeout(300);
        
        const filaAfiliado = this.tableRows.filter({
            has: this.page.locator('td', { hasText: nombre })
        }).filter({
            has: this.page.locator('td', { hasText: apellidos })
        }).filter({
            has: this.page.locator('td', { hasText: dni })
        });
        
        await expect(filaAfiliado).toBeVisible({ timeout: 5000 });
        return filaAfiliado;
    }

    async editarAfiliado(nombre: string) {
        const filaAfiliado = this.tableRows.filter({
            has: this.page.locator('td', { hasText: nombre })
        });
        
        await filaAfiliado.locator('.edit-button').click();
    }

    async toggleEstadoAfiliado(nombre: string) {
        const filaAfiliado = this.tableRows.filter({
            has: this.page.locator('td', { hasText: nombre })
        });
        
        await filaAfiliado.locator('.toggle-button').click();
    }

    async verificarCantidadAfiliados(activos: string, inactivos: string, total: string) {
        await expect(this.afiliadosActivosCount).toHaveText(activos);
        await expect(this.afiliadosInactivosCount).toHaveText(inactivos);
        await expect(this.totalAfiliadosCount).toHaveText(total);
    }

    async volverAlDashboard() {
        await this.volverDashboardButton.click();
        await this.page.waitForURL('/dashboard');
    }

    async getNumeroDeFilas() {
        return await this.tableRows.count();
    }

    async verificarTablaVacia() {
        const noDataCell = this.page.locator('td:has-text("No hay afiliados registrados")');
        await expect(noDataCell).toBeVisible();
    }
}
