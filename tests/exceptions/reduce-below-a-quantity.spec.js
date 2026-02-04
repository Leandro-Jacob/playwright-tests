import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { adicionarProdutoHome, abrirCarrinhoTopo } from '../../helpers/home';

test('Reduce below a quantity', async ({ page }) => {
  test.setTimeout(60000);

  await login(page);

  // Garante que tem item (se carrinho estiver vazio, adiciona 1 produto)
  await abrirCarrinhoTopo(page);
  const carrinhoVazio = await page.getByText(/Seu carrinho está vazio/i).isVisible().catch(() => false);
  if (carrinhoVazio) {
    await page.goto('https://qas.central-brf.com.br/');
    await adicionarProdutoHome(page, 1);
    await abrirCarrinhoTopo(page);
  }

  const btnReduzir = page.getByRole('button', { name: /Reduzir quantidade/i }).first();

  // Se por algum motivo a quantidade vier > 1, reduz até travar (máx 10 cliques)
  for (let i = 0; i < 10; i++) {
    const enabled = await btnReduzir.isEnabled().catch(() => false);
    if (!enabled) break;
    await btnReduzir.click();
    await page.waitForTimeout(200);
  }

  // ✅ Exceção esperada: em 1 o botão não pode ser clicável
  await expect(btnReduzir).toBeDisabled();
});
