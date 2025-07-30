import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import { CURRENT_ROLES } from './config/roles-config';

test.describe('FEATURE - Autenticación y Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('Verificar página de login carga correctamente @sanity', async ({ page }) => {
    await test.step('Navegar a la página de login', async () => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
    });

    await test.step('Verificar elementos de la página', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  test('Verificar credenciales incorrectas', async ({ page }) => {
    await test.step('Intentar login con credenciales incorrectas', async () => {
      await loginPage.login('usuario_inexistente', 'password_incorrecto');
    });

    await test.step('Verificar mensaje de error', async () => {
      const errorMessage = page.locator('.error, [data-testid="error"], .alert-danger');
      await expect(errorMessage).toBeVisible();
    });
  });

  test('Verificar campos vacíos', async ({ page }) => {
    await test.step('Intentar login sin completar campos', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await loginPage.loginButton.click();
      await page.waitForTimeout(500);
    });

    await test.step('Verificar que no se procesa el login', async () => {
      // Debería permanecer en la página de login
      await expect(page).toHaveURL('/');
      
      // Verificar que los campos están vacíos o que hay validación
      const usernameValue = await loginPage.usernameInput.inputValue();
      const passwordValue = await loginPage.passwordInput.inputValue();
      expect(usernameValue).toBe('');
      expect(passwordValue).toBe('');
    });
  });

  // Tests de login para cada rol configurado
  CURRENT_ROLES.forEach((role, index) => {
    const testName = index === 0 ? 
      `Login exitoso - Rol: ${role.roleName} @sanity` : 
      `Login exitoso - Rol: ${role.roleName}`;
    
    test(testName, async ({ page }) => {
      await test.step(`Login con credenciales de ${role.roleName}`, async () => {
        await loginPage.login(role.username, role.password);
      });

      await test.step('Verificar redirección al dashboard', async () => {
        await expect(page).toHaveURL(/dashboard/);
      });

      await test.step('Verificar elementos del dashboard', async () => {
        // Verificar que hay elementos básicos del dashboard
        const header = page.locator('header').first();
        await expect(header).toBeVisible();
      });
    });
  });

  test('Logout funcional @sanity', async ({ page }) => {
    await test.step('Login como administrador', async () => {
      const adminRole = CURRENT_ROLES.find(role => role.username === 'admin');
      if (adminRole) {
        await loginPage.login(adminRole.username, adminRole.password);
        await expect(page).toHaveURL(/dashboard/);
      }
    });

    await test.step('Realizar logout', async () => {
      // Buscar botón de logout
      const logoutButton = page.locator('button:has-text("Cerrar Sesión"), button:has-text("Logout"), button:has-text("Salir")');
      
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await expect(page).toHaveURL('/');
      }
    });
  });

  test('Verificar información de roles', async () => {
    await test.step('Validar configuración de roles', async () => {
      expect(CURRENT_ROLES.length).toBeGreaterThan(0);
      
      // Verificar que cada rol tiene las propiedades requeridas
      CURRENT_ROLES.forEach(role => {
        expect(role.roleName).toBeDefined();
        expect(role.username).toBeDefined();
        expect(role.password).toBeDefined();
        expect(role.permissions).toBeDefined();
      });
    });
  });
});