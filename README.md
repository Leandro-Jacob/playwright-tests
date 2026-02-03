# 📌 Projeto de Automação – Central BRF (Playwright)

## 📋 Objetivo

Este projeto tem como objetivo automatizar os principais fluxos do e-commerce Central BRF, validando:

- Funcionalidades críticas
- Fluxos de compra
- Tratamento de erros
- Experiência do usuário

A automação foi construída utilizando Playwright, com foco em testes End-to-End (E2E).

---

## 🛠️ Tecnologias

- Node.js  
- Playwright  
- JavaScript  
- Chromium (principal navegador)

---

## 📂 Estrutura do Projeto

```text
playwright-tests/
├── helpers/        → Funções reutilizáveis (login, carrinho, home)
├── tests/
│   ├── happy-path/ → Fluxos principais
│   └── exceptions/→ Cenários de erro
├── playwright.config.js
└── package.json

## ✅ Tipos de Testes

### Happy Path
- Login
- Adicionar produto
- Carrinho
- Checkout

### Exceptions
- Carrinho vazio
- Cupom inválido
- Produto sem estoque

▶️ Executar os Testes

## Rodar todos

npx playwright test

## Rodar específico

npx playwright test tests/happy-path/login.spec.js --headed

## 🎯 Tipo de Teste

O projeto é focado em testes End-to-End (E2E), validando o fluxo completo do usuário, desde o login até a finalização da compra.

## 📈 Benefícios

Redução de falhas manuais

Validação de fluxos críticos

Apoio ao negócio

Mais segurança em releases

Agilidade em testes regressivos


## 👨‍💻 Responsável

Leandro Jacob - QA


