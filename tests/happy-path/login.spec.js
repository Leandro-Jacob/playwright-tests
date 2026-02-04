import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

test('Successful login', async ({ page }) => {
  await login(page);

  // ✅ Se aparecer esse texto, login falhou
  await expect(page.getByText('A sua senha não corresponde aos padrões de segurança.')).toHaveCount(0);

  // ✅ validação simples pós-login
  await expect(page.getByPlaceholder('O que está procurando hoje?')).toBeVisible({ timeout: 30000 });

  await page.waitForTimeout(5000);
});
