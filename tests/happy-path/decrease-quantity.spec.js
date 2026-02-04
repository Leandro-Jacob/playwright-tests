import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { adicionarProdutoHome, abrirCarrinhoTopo } from '../../helpers/home';
import { reduzirQuantidadeCarrinho } from '../../helpers/carrinho';

test('Decrease quantity', async ({ page }) => {
  test.setTimeout(90000);

  await login(page);

  // 1) Adiciona produto e abre carrinho
  await adicionarProdutoHome(page, 1);
  await abrirCarrinhoTopo(page);
 
   // 2) Confirma que está no carrinho
  await expect(page.getByRole('heading', { name: /Carrinho/i })).toBeVisible({ timeout: 30000 });
 
   // 3) Reduz a quantidade 2x
  await reduzirQuantidadeCarrinho(page, 2);

   // 4) validação 
  await expect(
    page.getByRole('button', { name: /Ir para o pagamento/i })
  ).toBeVisible({ timeout: 30000 });
 
  await page.waitForTimeout(3000);
});
