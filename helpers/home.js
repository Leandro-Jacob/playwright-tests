export async function adicionarProdutoHome(page, indice = 1) {
  const addToCartButton = page.getByRole('button', { name: /Adicionar ao carrinho/i }).nth(indice);
  await addToCartButton.click();
}

export async function abrirCarrinhoTopo(page) {
  const linkCarrinho = page.getByRole('link', { name: /Carrinho/i });

  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    await linkCarrinho.waitFor({ state: 'visible', timeout: 30000 });
    await linkCarrinho.click();

    const foi = await page.waitForURL(/\/cart/i, { timeout: 30000 })
      .then(() => true)
      .catch(() => false);

    if (!foi) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      continue;
    }

    const temExcluir = page.getByRole('button', { name: /^Excluir\s+/i }).first();
    const msgCarrinhoVazio = page.getByText(/Seu carrinho está vazio/i).first();

    const carregou = await Promise.race([
      temExcluir.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false),
      msgCarrinhoVazio.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false),
    ]);

    if (carregou) return;

    await page.reload({ waitUntil: 'domcontentloaded' });
  }

  throw new Error('Carrinho não carregou após 2 tentativas.');
}
