export async function aumentarQuantidadeCarrinho(page, vezes = 1) {
  const btn = page.getByRole('button', { name: /Aumentar quantidade/i }).first();
  await btn.waitFor({ state: 'visible', timeout: 30000 });

  for (let i = 0; i < vezes; i++) {
    await btn.click();
  }
}

export async function reduzirQuantidadeCarrinho(page, vezes = 1) {
  const btn = page.getByRole('button', { name: /Reduzir quantidade/i }).first();
  await btn.waitFor({ state: 'visible', timeout: 30000 });

  for (let i = 0; i < vezes; i++) {
    await btn.click();
  }
}

export async function removerPrimeiroItemCarrinho(page) {
  // proteção: se estiver deslogado, falha com erro claro
  const botaoEntrar = page.getByRole('button', { name: /Entrar\s*\/\s*Cadastrar/i });
  if (await botaoEntrar.isVisible().catch(() => false)) {
    throw new Error('Usuário não está logado. Botão "Entrar / Cadastrar" visível.');
  }

  const botoesExcluir = page.getByRole('button', { name: /^Excluir\s+/i });
  const before = await botoesExcluir.count();

  if (before === 0) {
    throw new Error('Carrinho não possui itens para remover.');
  }

  await botoesExcluir.first().click();
  return before;
}
