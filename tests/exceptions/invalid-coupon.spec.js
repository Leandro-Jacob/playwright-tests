import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { abrirCarrinhoTopo } from '../../helpers/home';

test('Invalid coupon', async ({ page }) => {
  test.setTimeout(60000);

  await login(page);
  await abrirCarrinhoTopo(page);

  // campo do cupom
  const inputCupom = page.getByRole('textbox', { name: /Digite o seu cupom aqui/i });
  await inputCupom.waitFor({ state: 'visible', timeout: 30000 });

  await inputCupom.fill('VALE10');

  await page.getByRole('button', { name: /Aplicar Cupom/i }).click();

  // ✅ valida mensagem exata 
  await expect(
    page.getByText(/Erro ao aplicar o cupom:\s*O cupom\s*VALE10\s*é inválido\./i)
  ).toBeVisible({ timeout: 30000 });

  // ✅ garantir que não aplicou desconto
  await expect(
    page.getByText(/cupom aplicado|desconto aplicado|aplicado com sucesso/i)
  ).toHaveCount(0);
});