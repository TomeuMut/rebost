import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './smoke',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4175', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/serve-static.mjs',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
    timeout: 60_000,
    env: { HOST: '127.0.0.1', PORT: '4175', NUXT_PUBLIC_SUPABASE_URL: '', NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '' },
  },
})
