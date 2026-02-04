import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';

test('Fifo out of stock remove item', async ({ page }) => {
  test.setTimeout(90000);

  await login(page);

  // garante que está logado
  await expect(page.getByRole('button', { name: /Entrar\s*\/\s*Cadastrar/i }))
    .toBeHidden({ timeout: 30000 });

  // Ir para Data Avançada
  await page.getByRole('link', { name: 'Data Avançada' }).click();
  await page.waitForLoadState('domcontentloaded');

  // Ir para aba Faixa Vermelha
  await page.getByRole('button', { name: /Faixa Vermelha/i }).click();

  // Adicionar o primeiro FIFO disponível
  const opcaoFaixaVermelha = page.getByRole('option', { name: /VENCIMENTO DO PRODUTO/i }).first();
  await expect(opcaoFaixaVermelha).toBeVisible({ timeout: 30000 });

  await opcaoFaixaVermelha.getByLabel(/Adicionar ao carrinho/i).click();

  // Abrir carrinho
  await page.getByRole('link', { name: /Carrinho:/i }).click();
  await expect(page).toHaveURL(/\/cart/i, { timeout: 30000 });

  // Validar popup “Produtos com estoque excedente”
  const popupTitulo = page.getByText(/Produtos com estoque excedente/i);
  await expect(popupTitulo).toBeVisible({ timeout: 30000 });

  // valida texto
  await expect(page.getByText(/quantidades foram ajustadas automaticamente/i)).toBeVisible();
  await expect(page.getByText(/Quantidade disponível:/i)).toBeVisible();

  await expect(page.getByText(/Quantidade disponível:\s*0/i)).toBeVisible();

  // fechar popup
  const btnFechar = page
    .getByRole('contentinfo')
    .filter({ hasText: /Fechar/i })
    .getByRole('button');

  await expect(btnFechar).toBeVisible();
  await btnFechar.click();

  // garante que popup sumiu 
  await expect(popupTitulo).toBeHidden({ timeout: 30000 });
});
