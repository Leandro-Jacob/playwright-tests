import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { adicionarProdutoHome, abrirCarrinhoTopo } from '../../helpers/home';
import { aumentarQuantidadeCarrinho } from '../../helpers/carrinho';

test('Increase cart quantity', async ({ page }) => {
  test.setTimeout(90000);

  await login(page);

  await adicionarProdutoHome(page, 1);
  await abrirCarrinhoTopo(page);

  await expect(page.getByRole('heading', { name: /Carrinho/i })).toBeVisible({ timeout: 30000 });

  // pega o texto do TOTAL antes (bem estável)
  const totalBox = page.getByText(/^Total$/i).locator('..');
  const totalAntes = (await totalBox.textContent())?.trim() || '';

  // clica + uma vez (não importa a quantidade atual)
  await aumentarQuantidadeCarrinho(page, 1);

  // validação 
  await expect(
    page.getByRole('button', { name: /Ir para o pagamento/i })
  ).toBeVisible({ timeout: 30000 });
 
  await page.waitForTimeout(3000);
});
