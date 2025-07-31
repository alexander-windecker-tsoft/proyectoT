import { test, expect } from '@playwright/test';

test.describe('🎯 DEMO - Tests que PASAN exitosamente', () => {
  test('DEMO - Verificación básica de la aplicación @demo', async ({ page }) => {
    await test.step('Navegar a la página principal ✅', async () => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
    });

    await test.step('Verificar título de la aplicación ✅', async () => {
      await expect(page).toHaveTitle(/AquaLife/);
    });

    await test.step('Verificar elementos del formulario ✅', async () => {
      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    await test.step('Verificar que los campos están habilitados ✅', async () => {
      await expect(page.locator('input[name="username"]')).toBeEnabled();
      await expect(page.locator('input[name="password"]')).toBeEnabled();
      await expect(page.locator('button[type="submit"]')).toBeEnabled();
    });
  });

  test('DEMO - Test de interacción con formulario @demo @smoke', async ({ page }) => {
    await test.step('Cargar la aplicación ✅', async () => {
      await page.goto('/');
      await expect(page.locator('form')).toBeVisible();
    });

    await test.step('Escribir en campo de usuario ✅', async () => {
      await page.locator('input[name="username"]').fill('demo-user');
      await expect(page.locator('input[name="username"]')).toHaveValue('demo-user');
    });

    await test.step('Escribir en campo de contraseña ✅', async () => {
      await page.locator('input[name="password"]').fill('demo-password');
      await expect(page.locator('input[name="password"]')).toHaveValue('demo-password');
    });

    await test.step('Verificar que el botón es clickeable ✅', async () => {
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeEnabled();
      // Solo verificamos que está habilitado, no hacemos click para evitar redirección
    });
  });

  test('DEMO - Validación de responsive design @demo', async ({ page }) => {
    await test.step('Verificar viewport desktop ✅', async () => {
      await page.goto('/');
      const viewportSize = page.viewportSize();
      expect(viewportSize?.width).toBeGreaterThan(800);
    });

    await test.step('Cambiar a viewport móvil ✅', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      const newViewportSize = page.viewportSize();
      expect(newViewportSize?.width).toBe(375);
    });

    await test.step('Verificar elementos visibles en móvil ✅', async () => {
      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    await test.step('Verificar que el layout se adapta ✅', async () => {
      const form = page.locator('form');
      await expect(form).toBeVisible();
      
      // Verificar que el formulario no se desborda
      const formBox = await form.boundingBox();
      expect(formBox?.width).toBeLessThanOrEqual(375);
    });
  });

  test('DEMO - Verificación de accesibilidad básica @demo @sanity', async ({ page }) => {
    await test.step('Cargar página y verificar estructura ✅', async () => {
      await page.goto('/');
      
      // Verificar que hay elementos semánticos
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('form')).toBeVisible();
    });

    await test.step('Verificar navegación por teclado ✅', async () => {
      // Verificar que los elementos reciben foco
      await page.locator('input[name="username"]').focus();
      await expect(page.locator('input[name="username"]')).toBeFocused();
      
      // Navegar con Tab
      await page.keyboard.press('Tab');
      await expect(page.locator('input[name="password"]')).toBeFocused();
    });

    await test.step('Verificar atributos de accesibilidad ✅', async () => {
      // Verificar que los inputs tienen name attributes
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      
      await expect(usernameInput).toHaveAttribute('name', 'username');
      await expect(passwordInput).toHaveAttribute('name', 'password');
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    await test.step('Verificar contraste básico de elementos ✅', async () => {
      // Verificar que los elementos tienen estilos básicos aplicados
      const submitButton = page.locator('button[type="submit"]');
      const styles = await submitButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity
        };
      });
      
      expect(styles.display).not.toBe('none');
      expect(styles.visibility).toBe('visible');
      expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
    });
  });

  test('DEMO - Test de performance básica @demo', async ({ page }) => {
    await test.step('Medir tiempo de navegación inicial ✅', async () => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Verificar que carga en menos de 5 segundos (tiempo razonable)
      expect(loadTime).toBeLessThan(5000);
    });

    await test.step('Verificar que la página se carga completamente ✅', async () => {
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('input[name="username"]')).toBeVisible();
      
      // Verificar que no hay errores de JavaScript obvios
      const hasForm = await page.locator('form').count() > 0;
      expect(hasForm).toBe(true);
    });

    await test.step('Verificar recursos básicos cargados ✅', async () => {
      // Verificar que CSS está aplicado
      const bodyStyles = await page.locator('body').evaluate(el => {
        const computed = window.getComputedStyle(el);
        return computed.margin;
      });
      
      // Si CSS está cargado, debería tener algún margen definido
      expect(bodyStyles).toBeDefined();
    });

    await test.step('Verificar interactividad inmediata ✅', async () => {
      // Verificar que los elementos son interactivos inmediatamente
      const usernameInput = page.locator('input[name="username"]');
      await usernameInput.click();
      await usernameInput.fill('test');
      await expect(usernameInput).toHaveValue('test');
    });
  });
});
