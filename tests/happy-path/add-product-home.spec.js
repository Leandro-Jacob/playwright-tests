import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { adicionarProdutoHome, abrirCarrinhoTopo } from '../../helpers/home';

test('Add product home', async ({ page }) => {
  test.setTimeout(60000);

  // 1) Login
  await login(page);

  // 2) Se aparecer esse texto, login falhou
  await expect(page.getByText('A sua senha não corresponde aos padrões de segurança.')).toHaveCount(0);

  // 3) Adiciona o 2º produto da home
  await adicionarProdutoHome(page, 1);

  // 4) Abre carrinho
  await abrirCarrinhoTopo(page);

  // 5) Valida que está no carrinho
  await expect(page.getByRole('heading', { name: /Carrinho/i })).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('button', { name: /Ir para o pagamento/i })).toBeVisible({ timeout: 30000 });

  await page.waitForTimeout(3000);
});