export async function login(page) {
  
  await page.goto('/');

  await page.getByRole('button', { name: 'Entrar / Cadastrar' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).fill(process.env.USER_EMAIL);
  await page.getByRole('textbox', { name: 'Senha' }).fill(process.env.USER_PASS);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
}
