export async function adicionarProdutoHome(page, indice = 1) {
  const addToCartButton = page
    .getByRole('button', { name: /Adicionar ao carrinho/i })
    .nth(indice);

  // garante que o botão está na tela e visível
  await addToCartButton.scrollIntoViewIfNeeded();
  await addToCartButton.waitFor({ state: 'visible', timeout: 60000 });

  // evita ficar preso esperando "navigation to finish"
  await addToCartButton.click({ noWaitAfter: true });

  // CI costuma precisar de um respiro para UI atualizar
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
}

export async function abrirCarrinhoTopo(page) {
  const linkCarrinho = page.getByRole('link', { name: /Carrinho/i });

  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    await linkCarrinho.waitFor({ state: 'visible', timeout: 30000 });

    // evita ficar preso esperando navegação
    await linkCarrinho.click({ noWaitAfter: true });

    // aceita mais de um padrão de URL (dependendo do ambiente/rota)
    const foi = await page
      .waitForURL(/(\/cart|carrinho)/i, { timeout: 45000 })
      .then(() => true)
      .catch(() => false);

    if (!foi) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      continue;
    }

    const temExcluir = page.getByRole('button', { name: /^Excluir\s+/i }).first();
    const msgCarrinhoVazio = page.getByText(/Seu carrinho está vazio/i).first();

    const carregou = await Promise.race([
      temExcluir.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false),
      msgCarrinhoVazio.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false),
    ]);

    if (carregou) return;

    await page.reload({ waitUntil: 'domcontentloaded' });
  }

  throw new Error('Carrinho não carregou após 2 tentativas.');
}