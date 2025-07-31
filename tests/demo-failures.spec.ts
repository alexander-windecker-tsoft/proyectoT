import { test, expect } from '@playwright/test';

test.describe('🎭 DEMO - Tests que fallan intencionalmente', () => {
  
  test('DEMO - Validación de API inexistente @demo', async ({ page }) => {
    await test.step('Navegar a la aplicación ✅', async () => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
    });

    await test.step('Verificar elementos básicos de la página ✅', async () => {
      // Estos elementos sí existen y deberían pasar
      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    await test.step('Interceptar llamada API que falla ❌', async () => {
      // Interceptar una API que no existe
      await page.route('**/api/usuarios-premium', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      // Intentar hacer una acción que active esta API (FALLA INTENCIONAL)
      const botonPremium = page.locator('button:has-text("Activar Premium")');
      await expect(botonPremium).toBeVisible({ timeout: 3000 });
    });

    await test.step('Verificar respuesta exitosa (FALLA INTENCIONAL) ❌', async () => {
      // Verificar que aparece un mensaje de éxito que nunca va a aparecer
      const mensajeExito = page.locator('text="¡Premium activado correctamente!"');
      await expect(mensajeExito).toBeVisible({ timeout: 2000 });
    });
  });

  test('DEMO - Formulario con validaciones extremas @demo @sanity', async ({ page }) => {
    await test.step('Navegar al formulario de login ✅', async () => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
    });

    await test.step('Verificar campos del formulario ✅', async () => {
      // Verificar que los campos están presentes
      const usernameField = page.locator('input[name="username"]');
      const passwordField = page.locator('input[name="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await expect(usernameField).toBeVisible();
      await expect(passwordField).toBeVisible();
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();
    });

    await test.step('Llenar formulario con datos incorrectos ✅', async () => {
      await page.fill('input[name="username"]', 'usuario-super-administrador');
      await page.fill('input[name="password"]', 'password-ultra-secreto-123');
      await page.click('button[type="submit"]');
      
      // Verificar que los valores se llenaron correctamente
      await expect(page.locator('input[name="username"]')).toHaveValue('usuario-super-administrador');
    });

    await test.step('Verificar que permanece en página de login ✅', async () => {
      // Verificar que no se redirige porque las credenciales son incorrectas
      await expect(page).toHaveURL('/');
      await expect(page.locator('input[name="username"]')).toBeVisible();
    });

    await test.step('Verificar acceso a panel de administración (FALLA) ❌', async () => {
      // Esperar estar en un panel de admin que no existe (FALLA INTENCIONAL)
      await expect(page).toHaveURL('/super-admin-dashboard');
    });

    await test.step('Verificar elementos específicos del panel (FALLA) ❌', async () => {
      // Verificar elementos específicos del panel de admin (FALLA INTENCIONAL)
      await expect(page.locator('h1')).toHaveText('Panel de Super Administrador');
      await expect(page.locator('[data-testid="admin-controls"]')).toBeVisible();
    });
  });

  test('DEMO - Performance test que falla @demo', async ({ page }) => {
    await test.step('Navegar a la aplicación ✅', async () => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
    });

    await test.step('Verificar que la página se carga ✅', async () => {
      // Verificar que elementos básicos están presentes
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('input[name="username"]')).toBeVisible();
      
      // Verificar título o contenido básico
      const hasLoginForm = await page.locator('form').count() > 0;
      expect(hasLoginForm).toBe(true);
    });

    await test.step('Medir tiempo de carga (FALLA) ❌', async () => {
      const startTime = Date.now();
      await page.reload();
      const loadTime = Date.now() - startTime;
      
      // Verificar que carga en menos de 100ms (FALLA INTENCIONAL)
      expect(loadTime).toBeLessThan(100);
    });

    await test.step('Verificar elementos cargan instantáneamente (FALLA) ❌', async () => {
      // Verificar que elementos aparecen inmediatamente (FALLA INTENCIONAL)
      const elemento = page.locator('input[name="username"]');
      await expect(elemento).toBeVisible({ timeout: 50 });
    });

    await test.step('Validar que no hay JavaScript errors (FALLA) ❌', async () => {
      // Inyectar un error de JavaScript (FALLA INTENCIONAL)
      await page.evaluate(() => {
        throw new Error('Error de demo para mostrar en el reporte');
      });
    });
  });

  test('DEMO - Test de responsive design que falla @demo', async ({ page }) => {
    await test.step('Verificar viewport inicial ✅', async () => {
      // Verificar que empezamos con viewport desktop
      await page.goto('/');
      const viewportSize = page.viewportSize();
      expect(viewportSize?.width).toBeGreaterThan(1000);
    });

    await test.step('Cambiar a viewport móvil ✅', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verificar que el viewport cambió correctamente
      const newViewportSize = page.viewportSize();
      expect(newViewportSize?.width).toBe(375);
      expect(newViewportSize?.height).toBe(667);
    });

    await test.step('Verificar que elementos básicos siguen visibles ✅', async () => {
      // Verificar que los elementos principales siguen siendo accesibles en móvil
      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    await test.step('Verificar menú móvil específico (FALLA) ❌', async () => {
      // Buscar un menú hamburguesa que no existe (FALLA INTENCIONAL)
      const menuHamburguesa = page.locator('[data-testid="mobile-menu-button"]');
      await expect(menuHamburguesa).toBeVisible();
      await menuHamburguesa.click();
    });

    await test.step('Verificar elementos móviles específicos (FALLA) ❌', async () => {
      // Verificar elementos específicos del diseño móvil (FALLA INTENCIONAL)
      const menuMobile = page.locator('[data-testid="mobile-sidebar"]');
      await expect(menuMobile).toBeVisible();
      
      const closeButton = page.locator('[data-testid="close-mobile-menu"]');
      await expect(closeButton).toBeVisible();
    });
  });

  test('DEMO - Test de accesibilidad que falla @demo', async ({ page }) => {
    await test.step('Navegar a la aplicación ✅', async () => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
    });

    await test.step('Verificar estructura HTML básica ✅', async () => {
      // Verificar que existe estructura HTML válida
      await expect(page.locator('html')).toBeVisible();
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('form')).toBeVisible();
    });

    await test.step('Verificar que elementos tienen atributos básicos ✅', async () => {
      // Verificar atributos que sí existen
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      
      await expect(usernameInput).toHaveAttribute('name', 'username');
      await expect(passwordInput).toHaveAttribute('name', 'password');
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    await test.step('Verificar contraste de colores (FALLA) ❌', async () => {
      // Verificar que todos los elementos tienen buen contraste (FALLA INTENCIONAL)
      const elemento = page.locator('body');
      const styles = await elemento.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor
        };
      });
      
      // Verificar colores específicos que no van a coincidir (FALLA INTENCIONAL)
      expect(styles.color).toBe('rgb(255, 255, 255)');
      expect(styles.backgroundColor).toBe('rgb(0, 0, 0)');
    });

    await test.step('Verificar etiquetas ARIA (FALLA) ❌', async () => {
      // Verificar etiquetas ARIA específicas que no existen (FALLA INTENCIONAL)
      const botonAccesible = page.locator('[aria-label="Botón de acceso principal"]');
      await expect(botonAccesible).toBeVisible();
      
      const region = page.locator('[role="main"][aria-labelledby="main-heading"]');
      await expect(region).toBeVisible();
    });
  });

  test('DEMO - Test mixto con mayoría de éxitos @demo', async ({ page }) => {
    await test.step('Navegar a la página principal ✅', async () => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
    });

    await test.step('Verificar título de la página ✅', async () => {
      await expect(page).toHaveTitle(/AquaLife/);
    });

    await test.step('Verificar formulario de login completo ✅', async () => {
      // Verificar todos los elementos del formulario
      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Verificar que los campos están habilitados
      await expect(page.locator('input[name="username"]')).toBeEnabled();
      await expect(page.locator('input[name="password"]')).toBeEnabled();
      await expect(page.locator('button[type="submit"]')).toBeEnabled();
    });

    await test.step('Verificar interacción con campos ✅', async () => {
      // Probar que se puede escribir en los campos
      await page.fill('input[name="username"]', 'test-user');
      await page.fill('input[name="password"]', 'test-pass');
      
      // Verificar que los valores se guardaron
      await expect(page.locator('input[name="username"]')).toHaveValue('test-user');
      await expect(page.locator('input[name="password"]')).toHaveValue('test-pass');
    });

    await test.step('Verificar comportamiento del formulario ✅', async () => {
      // Limpiar campos
      await page.fill('input[name="username"]', '');
      await page.fill('input[name="password"]', '');
      
      // Verificar que están vacíos
      await expect(page.locator('input[name="username"]')).toHaveValue('');
      await expect(page.locator('input[name="password"]')).toHaveValue('');
    });

    await test.step('Verificar estructura CSS básica ✅', async () => {
      // Verificar que los elementos tienen estilos aplicados
      const usernameInput = page.locator('input[name="username"]');
      const styles = await usernameInput.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility
        };
      });
      
      expect(styles.display).not.toBe('none');
      expect(styles.visibility).toBe('visible');
    });

    await test.step('Buscar elemento premium inexistente (FALLA) ❌', async () => {
      // Este paso falla intencionalmente para mostrar el contraste
      const premiumBadge = page.locator('[data-testid="premium-badge"]');
      await expect(premiumBadge).toBeVisible({ timeout: 2000 });
    });

    await test.step('Verificar funcionalidad que no existe (FALLA) ❌', async () => {
      // Buscar un botón de configuración avanzada que no existe
      const configButton = page.locator('button:has-text("Configuración Avanzada")');
      await expect(configButton).toBeVisible({ timeout: 1500 });
    });
  });
});
