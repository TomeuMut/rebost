import tailwindcss from '@tailwindcss/vite';
export default defineNuxtConfig({
  compatibilityDate: '2026-10-11',
  devtools: { enabled: false },
  css: ['~/../src/styles/global.css'],
  vite: { plugins: [tailwindcss()] },
  app: { head: { title: 'Rebost · Tu despensa, en orden', htmlAttrs: { lang: 'es' }, meta: [{ name: 'description', content: 'Organiza tu despensa: productos, lotes y movimientos de existencias.' }, { name: 'theme-color', content: '#234b40' }], link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }] } },
});
