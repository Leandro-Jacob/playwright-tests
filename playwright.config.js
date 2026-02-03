// @ts-check
require('dotenv').config();

import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Pasta dos testes
  testDir: './tests',

  // Executa testes em paralelo
  fullyParallel: true,

  // Bloqueia test.only em CI
  forbidOnly: !!process.env.CI,

  // Retry apenas em CI
  retries: process.env.CI ? 2 : 0,

  // Workers em CI
  workers: process.env.CI ? 1 : undefined,

  // Report HTML
  reporter: 'html',

  // Configuração padrão
  use: {
    baseURL: process.env.BASE_URL,

    trace: 'on',

    screenshot: 'on',

    video: 'on',

    // IMPORTANTE: remove viewport fixa
    viewport: null,

    // Abre maximizado
    launchOptions: {
      args: ['--start-maximized'],
    },
  },

  // Projetos / Browsers
  projects: [
    {
      name: 'chromium',

      use: {
        // Mantém viewport livre
        viewport: null,

        // Força maximizado no Chromium
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },

    // Exemplo para Firefox (se precisar no futuro)
    // {
    //   name: 'firefox',
    // },

    // Exemplo para WebKit (Safari)
    // {
    //   name: 'webkit',
    // },
  ],

  // WebServer (se usar)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
