import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { abrirCarrinhoTopo } from '../../helpers/home';

test('adicionar produto FIFO (Data Avançada) no carrinho', async ({ page }) => {
  test.setTimeout(90000);

  await login(page);

  // garante o login 
  await expect(page.getByRole('button', { name: /Entrar\s*\/\s*Cadastrar/i }))
    .toBeHidden({ timeout: 30000 });

  // ir para Data Avançada
  await page.getByRole('link', { name: 'Data Avançada' }).click();

  await page.waitForLoadState('domcontentloaded');

  const opcaoExata = page.getByRole('option', {
    name: /VENCIMENTO DO PRODUTO A PARTIR DE/i,
  }).first();

  await expect(opcaoExata).toBeVisible({ timeout: 30000 });

  // botão dentro da opção
  await opcaoExata.getByLabel('Adicionar ao carrinho').click();

  // abre carrinho
  await abrirCarrinhoTopo(page);

  // valida que tem item no carrinho
  const excluir = page
    .getByRole('button', { name: /^Excluir\s+/i })
    .or(page.getByRole('link', { name: /^Excluir\s+/i }))
    .first();

  await expect(excluir).toBeVisible({ timeout: 30000 });
});
