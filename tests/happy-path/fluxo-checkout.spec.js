import { test, expect } from '@playwright/test';
import { login } from '../../helpers/login';
import { adicionarProdutoHome, abrirCarrinhoTopo } from '../../helpers/home';

test.use({ screenshot: 'only-on-failure', video: 'retain-on-failure' });

test('QAS: fluxo completo de compra (BOLETO) + fecha popup no X + valida pedido realizado', async ({ page }) => {
  test.setTimeout(150000);

  // =========================
  // Helper local: fecha popup pelo X (SEM mexer em helpers do projeto)
  // =========================
  const fecharPopupNoXSeAparecer = async () => {
    // Sempre pega o modal SLDS visível (se houver mais de um, fecha o último no DOM)
    const container = page.locator('.slds-modal__container:visible').last();

    if (!(await container.isVisible().catch(() => false))) return;

    // X: tenta seletores mais robustos (title/aria-label/classe padrão do SLDS)
    const xFechar = container
      .locator('button.slds-modal__close, button[title="Fechar"], button[aria-label="Fechar"]')
      .first();

    if (await xFechar.isVisible().catch(() => false)) {
      await xFechar.click({ force: true });
    } else {
      // fallback 1: botão "Fechar" dentro do modal
      const btnFechar = container.getByRole('button', { name: /fechar/i }).first();
      if (await btnFechar.isVisible().catch(() => false)) {
        await btnFechar.click({ force: true });
      } else {
        // fallback 2: ESC
        await page.keyboard.press('Escape').catch(() => {});
      }
    }

    // fallback 3: se ainda estiver aberto, clica no backdrop
    if (await container.isVisible().catch(() => false)) {
      await page.locator('.slds-backdrop, .slds-backdrop_open').first().click({ force: true }).catch(() => {});
    }

    await expect(container).toBeHidden({ timeout: 30000 });
  };

  const esperarSpinners = async () => {
    const sp = page.locator('.slds-spinner_container, lightning-spinner');
    if (await sp.first().isVisible().catch(() => false)) {
      await expect(sp.first()).toBeHidden({ timeout: 30000 });
    }
  };

  // =========================
  // 1) Login
  // =========================
  await login(page);
  await expect(page.getByRole('button', { name: /Entrar\s*\/\s*Cadastrar/i })).toBeHidden({ timeout: 30000 });

  // =========================
  // 2) Produto -> Carrinho -> Checkout
  // =========================
  await adicionarProdutoHome(page, 1);
  await abrirCarrinhoTopo(page);

  await page.getByRole('button', { name: /Ir para o pagamento/i }).click();
  await expect(page.getByRole('heading', { name: /Checkout/i })).toBeVisible({ timeout: 30000 });

  // Se o popup aparecer já no checkout, fecha
  await fecharPopupNoXSeAparecer();

  // =========================
  // 3) Entrega (se existir)
  // =========================
  const enderecoFauxRadio = page.locator('.slds-radio_faux').first();
  if (await enderecoFauxRadio.isVisible().catch(() => false)) {
    await enderecoFauxRadio.click({ force: true });
  }

  const continuarEntrega = page.getByRole('button', { name: /Continuar para Formas de Entrega/i });
  if (await continuarEntrega.isVisible().catch(() => false)) {
    await continuarEntrega.click({ force: true });
  }

  const continuarPagamento = page.getByRole('button', { name: /Continuar para Pagamento/i });
  if (await continuarPagamento.isVisible().catch(() => false)) {
    await continuarPagamento.click({ force: true });
  }

  await esperarSpinners();
  await fecharPopupNoXSeAparecer();

  // =========================
  // 4) Pagamento: escolher BOLETO
  // =========================
  const secPagamento = page.locator('section').filter({ hasText: /Condição de pagamento/i }).first();
  await expect(secPagamento).toBeVisible({ timeout: 30000 });

  const escolherPagamento = secPagamento
    .getByRole('button', { name: /^Escolher$/i })
    .or(secPagamento.getByRole('link', { name: /^Escolher$/i }))
    .first();

  await expect(escolherPagamento).toBeVisible({ timeout: 30000 });
  await escolherPagamento.click({ force: true });

  const modalPagamento = page
    .locator('.slds-modal__container')
    .filter({ has: page.locator('#paymentDropdown') })
    .first();
  await expect(modalPagamento).toBeVisible({ timeout: 30000 });

  const paymentDropdown = modalPagamento.locator('#paymentDropdown');
  await expect(paymentDropdown).toBeVisible({ timeout: 30000 });
  await paymentDropdown.selectOption('BOLETO');

  const labelBoleto = modalPagamento.locator('label').filter({ hasText: /Pagar à vista no boleto/i }).first();
  await expect(labelBoleto).toBeVisible({ timeout: 30000 });
  await labelBoleto.click({ force: true });

  await modalPagamento.getByRole('button', { name: /^Salvar$/i }).click({ force: true });
  await expect(modalPagamento).toBeHidden({ timeout: 30000 });

  // Esse é o popup de confirmação (do print) -> fecha no X
  await fecharPopupNoXSeAparecer();

  // =========================
  // 5) Finalizar pedido
  // =========================
  await esperarSpinners();
  await fecharPopupNoXSeAparecer();

  const finalizar = page.getByRole('button', { name: /Finalizar Pedido/i });
  await expect(finalizar).toBeVisible({ timeout: 30000 });
  await expect(finalizar).toBeEnabled({ timeout: 30000 });
  await finalizar.click({ force: true });

  // =========================
  // 6) Validação final
  // =========================
  await expect(page.getByRole('heading', { name: /Pedido realizado!/i })).toBeVisible({ timeout: 30000 });
  await expect(page.getByText(/O número do seu pedido é/i)).toBeVisible({ timeout: 30000 });
});
