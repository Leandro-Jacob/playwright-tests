import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { abrirCarrinhoTopo } from '../../helpers/home';

test('carrinho vazio', async ({ page }) => {
  test.setTimeout(60000);

  await login(page);
 await expect(page.getByRole('button', { name: /Entrar\s*\/\s*Cadastrar/i }))
  .toBeHidden({ timeout: 30000 });


  await abrirCarrinhoTopo(page);

  // ✅ mensagem principal
  await expect(
    page.getByText(/Seu carrinho está vazio/i)
  ).toBeVisible({ timeout: 30000 });

  // ✅ não deve existir ação de remover
  await expect(
    page.getByRole('button', { name: /^Excluir\s+/i })
  ).toHaveCount(0);

  // ✅ não deve existir ação de checkout
  await expect(
    page.getByRole('button', { name: /Ir para o pagamento|Finalizar/i })
  ).toHaveCount(0);
});
