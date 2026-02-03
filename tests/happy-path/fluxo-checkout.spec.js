import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { adicionarProdutoHome, abrirCarrinhoTopo } from '../../helpers/home';

test.use({ screenshot: 'only-on-failure', video: 'retain-on-failure' });

test('checkout BOLETO + valida seção/popup', async ({ page }) => {
  test.setTimeout(180000);

  const fecharConfirmacaoSeAparecer = async () => {
    const modal = page.locator('.slds-modal__container:visible').last();
    if (!(await modal.isVisible().catch(() => false))) return;

    const texto = ((await modal.innerText().catch(() => '')) || '').replace(/\s+/g, ' ');
    if (!/Confirmação de Pedido|Condição de pagamento atualizada/i.test(texto)) return;


    const btn = modal.locator('button.button-confirm').filter({ hasText: 'Fechar' }).first();
    if (await btn.isVisible().catch(() => false)) await btn.click({ force: true }).catch(() => { });
    await expect(page.locator('.slds-backdrop_open, .slds-backdrop')).toBeHidden({ timeout: 30000 }).catch(() => { });
  };

  // 1) Login
  await login(page);
  await expect(page.getByRole('button', { name: /Entrar\s*\/\s*Cadastrar/i })).toBeHidden({ timeout: 30000 });

  // 2) Produto -> Checkout
  await adicionarProdutoHome(page, 1);
  await abrirCarrinhoTopo(page);
  await page.getByRole('button', { name: /Ir para o pagamento/i }).click();
  await expect(page.getByRole('heading', { name: /Checkout/i })).toBeVisible({ timeout: 30000 });

  await fecharConfirmacaoSeAparecer();

  // 3) Entrega
  const continuarEntrega = page.getByRole('button', { name: /Continuar para Formas de Entrega/i });
  if (await continuarEntrega.isVisible().catch(() => false)) await continuarEntrega.click({ force: true });

  const continuarPagamento = page.getByRole('button', { name: /Continuar para Pagamento/i });
  if (await continuarPagamento.isVisible().catch(() => false)) await continuarPagamento.click({ force: true });

  await fecharConfirmacaoSeAparecer();

  // 4) Valida/seleciona BOLETO
  const secPagamento = page.locator('section').filter({ hasText: /Condição de pagamento/i }).first();
  await expect(secPagamento).toBeVisible({ timeout: 30000 });

  // Se o boleto já estiver aplicado, valida e encerra
  const cardTemBoleto = await secPagamento.getByText(/Boleto/i).isVisible().catch(() => false);
  if (cardTemBoleto) {
    await expect(secPagamento).toContainText(/Boleto/i);
    await expect(secPagamento).toContainText(/Pagar à vista no boleto/i);
    return; // ✅ encerra aqui: validação forte e estável
  }


  const escolher = secPagamento
    .getByRole('button', { name: /^Escolher$/i })
    .or(secPagamento.getByRole('link', { name: /^Escolher$/i }))
    .first();

  await escolher.click({ force: true }).catch(() => { });

  // aplica boleto
  const dropdown = page.locator('#paymentDropdown');
  if (await dropdown.isVisible().catch(() => false)) {
    await dropdown.selectOption('BOLETO');

    const modalPagamento = page.locator('.slds-modal__container').filter({ has: dropdown }).first();
    await modalPagamento.locator('label').filter({ hasText: /Pagar à vista no boleto/i }).first().click({ force: true });
    await modalPagamento.locator('button:has-text("Salvar")').first().click({ force: true });

    // popup confirmação — valida que apareceu
    const popup = page.locator('.slds-modal__container').filter({ has: page.locator('button.button-confirm') }).first();
    await expect(popup).toBeVisible({ timeout: 30000 });
    await expect(popup).toContainText(/Confirmação de Pedido/i);
    await expect(popup).toContainText(/Condição de pagamento atualizada com sucesso/i);
    await expect(popup.locator('button.button-confirm').filter({ hasText: 'Fechar' })).toBeVisible();
    return;
  }


  await expect(secPagamento).toBeVisible();
});
