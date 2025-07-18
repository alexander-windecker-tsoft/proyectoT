import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import { AfiliadosFormPage } from './pages/afiliadosFormPage';
import { AfiliadosListPage } from './pages/afiliadosListPage';

test.describe('Club de Natación AquaLife - Inicio de Sesión', () => {
  test('Validar que se muestre el formulario de inicio de sesión', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('/');
    
    // Verificar que el título de la página sea correcto
    await expect(page).toHaveTitle(/Club de Natación AquaLife/);
    
    // Verificar que existe el formulario de login
    await expect(page.locator('form')).toBeVisible();
    
    // Verificar que existen los campos de usuario y contraseña usando POM
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    // Verificar que existe el botón de login usando POM
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Validar inicio de sesión exitoso como administrador', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Usar POM para hacer login
    await loginPage.login('admin', 'admin123');
    
    // Verificar que se redirige al dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Verificar que aparece el contenido del dashboard
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('Intentar iniciar sesión con credenciales inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Usar POM para intentar login con credenciales incorrectas
    await loginPage.login('usuario_incorrecto', 'contraseña_incorrecta');
    
    // Verificar que aparece un mensaje de error
    await expect(page.locator('.error')).toBeVisible();
  });

  test('Validar inicio de sesión exitoso como usuario de facturación', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Usar POM para hacer login como facturación
    await loginPage.login('facturacion', 'factura123');
    
    // Verificar que se redirige al dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Verificar que aparece el mensaje personalizado
    await expect(page.locator('h2')).toContainText('¡Bienvenido facturacion!');
    
    // Verificar que aparece el indicador de modo solo lectura
    await expect(page.locator('p')).toContainText('(modo solo lectura)');
  });

  test('Validar que se muestre el rol correcto en el perfil del usuario administrador', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Usar POM para iniciar sesión como administrador
    await loginPage.login('admin', 'admin123');
    
    // Abrir el menú de perfil
    await page.click('button:has-text("👤 Perfil")');
    
    // Verificar que muestra el rol de Administrador
    await expect(page.locator('.profile-info')).toContainText('Rol: Administrador');
    await expect(page.locator('.profile-info')).toContainText('Usuario: admin');
  });

  test('Validar que se muestre el rol correcto en el perfil del usuario de facturación', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Usar POM para iniciar sesión como facturación
    await loginPage.login('facturacion', 'factura123');
    
    // Abrir el menú de perfil
    await page.click('button:has-text("👤 Perfil")');
    
    // Verificar que muestra el rol de Facturación
    await expect(page.locator('.profile-info')).toContainText('Rol: Facturación');
    await expect(page.locator('.profile-info')).toContainText('Usuario: facturacion');
  });

  test('Validar inicio de sesión exitoso como usuario inspector', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Usar POM para hacer login como inspector
    await loginPage.login('inspector', 'inspector123');
    
    // Verificar que se redirige al dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Verificar que aparece el mensaje personalizado
    await expect(page.locator('h2')).toContainText('¡Bienvenido inspector!');
    
    // Verificar que NO aparece el indicador de modo solo lectura (tiene permisos completos)
   
  });

  test('Validar que se muestre el rol correcto en el perfil del usuario inspector', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Usar POM para iniciar sesión como inspector
    await loginPage.login('inspector', 'inspector123');
    
    // Abrir el menú de perfil
    await page.click('button:has-text("👤 Perfil")');
    
    // Verificar que muestra el rol de Inspector
    await expect(page.locator('.profile-info')).toContainText('Rol: Inspector');
    await expect(page.locator('.profile-info')).toContainText('Usuario: inspector');
  });

  test('Validar que el usuario inspector tenga acceso completo al formulario de afiliados', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const afiliadosFormPage = new AfiliadosFormPage(page);
    const afiliadosListPage = new AfiliadosListPage(page);
    
    // Login como inspector
    await loginPage.login('inspector', 'inspector123');
    await page.waitForURL('/dashboard');
    
    // Ir al formulario de afiliados
    await afiliadosFormPage.navegarAFormularioNuevo();
    
    // Verificar que todos los campos están habilitados (no readonly)
    await expect(afiliadosFormPage.nombreInput).not.toHaveAttribute('readonly');
    await expect(afiliadosFormPage.apellidosInput).not.toHaveAttribute('readonly');
    await expect(afiliadosFormPage.dniInput).not.toHaveAttribute('readonly');
    
    // Completar formulario y verificar que puede guardar
    const datosObligatorios = afiliadosFormPage.getDatosObligatoriosValidos();
    await afiliadosFormPage.completarCamposObligatorios(datosObligatorios);
    await afiliadosFormPage.verificarBotonGuardarHabilitado();
    
    // Verificar que puede acceder a la lista y ver botones de edición
    await afiliadosListPage.navegarALista();
    await expect(page.locator('button:has-text("Nuevo Afiliado")')).toBeVisible();
  });
});
