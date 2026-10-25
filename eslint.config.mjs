import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import globals from 'globals'

export default [
  { ignores: ['node_modules/**', '.astro/**', '.nuxt/**', '.output/**', '.vercel/**', 'dist/**', '.agents/**', '.claude/**', '.codex/**', '.vscode/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }] },
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
    // Nuxt auto-imports are validated by vue-tsc, rather than JS no-undef.
    rules: { 'no-undef': 'off', 'vue/multi-word-component-names': ['error', { ignores: ['app'] }] },
  },
  { files: ['app/pages/**/*.vue'], rules: { 'vue/multi-word-component-names': 'off' } },
]
