import { test, expect } from '@playwright/test';

test.describe('Playground E2E Flow', () => {
  test('should display landing page and allow scrolling to playground', async ({ page }) => {
    await page.goto('/');

    // Check title and hero headline
    await expect(page).toHaveTitle(/TalentMetrics/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Click CTA to navigate to playground
    const ctaLink = page.getByRole('link', { name: /Experimentar Playground IA/i });
    await expect(ctaLink).toBeVisible();
    await ctaLink.click();

    // Verify Playground section is in view
    const playgroundHeading = page.getByRole('heading', { name: /Teste a análise com IA/i });
    await expect(playgroundHeading).toBeVisible();
  });

  test('should show error when invalid file extension is uploaded', async ({ page }) => {
    await page.goto('/playground');

    const dropzoneInput = page.getByTestId('dropzone-input');
    await expect(dropzoneInput).toBeAttached();

    // Upload an invalid file type (.png)
    await dropzoneInput.setInputFiles({
      name: 'invalid.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake image content'),
    });

    // Check error message
    const alert = page.getByTestId('dropzone-error');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/não suportado/i);
  });
});

test.describe('Landing layout and accessibility', () => {
  test('keeps the header sticky after scrolling', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header').first();
    await page.evaluate(() => window.scrollTo(0, 1200));

    await expect
      .poll(async () => {
        const box = await header.boundingBox();
        return box ? Math.round(box.y) : -1;
      })
      .toBe(0);
  });

  test('does not nest buttons inside links', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('a button')).toHaveCount(0);
  });

  test('login modal traps focus and closes on Escape', async ({ page }) => {
    await page.goto('/');

    const trigger = page.getByRole('button', { name: 'Entrar' });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Área de Login' });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar janela' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

test.describe('Mobile layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('renders the hero headline in at most two lines', async ({ page }) => {
    await page.goto('/');

    const lineCount = await page.locator('h1').evaluate((element) => {
      const style = window.getComputedStyle(element);
      const lineHeight = Number.parseFloat(style.lineHeight);
      return Math.round(element.getBoundingClientRect().height / lineHeight);
    });

    expect(lineCount).toBeLessThanOrEqual(2);
  });
});
