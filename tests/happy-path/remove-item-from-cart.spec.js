import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { abrirCarrinhoTopo } from '../../helpers/home';
import { removerPrimeiroItemCarrinho } from '../../helpers/carrinho';

test('Remove item from cart', async ({ page }) => {
  test.setTimeout(60000);

  await login(page);

  // garante que login foi concluído
  await expect(
    page.getByRole('button', { name: /Entrar\s*\/\s*Cadastrar/i })
  ).toBeHidden({ timeout: 30000 });

  await abrirCarrinhoTopo(page);

  const before = await removerPrimeiroItemCarrinho(page);

  // validação Final
  await expect(
    page.getByRole('button', { name: /^Excluir\s+/i })
  ).toHaveCount(before - 1);
});