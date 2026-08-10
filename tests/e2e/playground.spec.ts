import { test, expect } from '@playwright/test';

test.describe('Playground E2E Flow', () => {
  test('should display landing page and allow scrolling to playground', async ({ page }) => {
    await page.goto('/');

    // Check title and hero headline
    await expect(page).toHaveTitle(/TalentMetrics/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Click CTA to navigate to playground
    const ctaButton = page.getByRole('button', { name: /Experimentar Playground IA/i });
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();

    // Verify Playground section is in view
    const playgroundHeading = page.getByRole('heading', { name: /Teste a Análise com IA/i });
    await expect(playgroundHeading).toBeVisible();
  });

  test('should show error when invalid file extension is uploaded', async ({ page }) => {
    await page.goto('/');

    const dropzoneInput = page.getByTestId('dropzone-input');
    await expect(dropzoneInput).toBeAttached();

    // Upload an invalid file type (.png)
    await dropzoneInput.setInputFiles({
      name: 'invalid.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake image content'),
    });

    // Check error message
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/não suportado/i);
  });
});
