import { translate, type Locale } from '../../src/i18n/messages';

export function useLanguage() {
  const locale = useState<Locale>('locale', () => 'es');
  const languageError = ref('');
  onMounted(() => {
    try {
      const saved = localStorage.getItem('rebost-language');
      if (saved === 'es' || saved === 'en' || saved === 'ca') locale.value = saved;
    } catch { /* The default language remains usable when storage is unavailable. */ }
  });
  const t = (message: string) => translate(locale.value, message);
  function setLocale(value: string) {
    if (value !== 'es' && value !== 'en' && value !== 'ca') return;
    locale.value = value;
    languageError.value = '';
    try { localStorage.setItem('rebost-language', value); }
    catch { languageError.value = 'No se ha podido guardar el idioma. Se mantendrá mientras esta pestaña siga abierta.'; }
  }
  useHead(() => ({ htmlAttrs: { lang: locale.value }, title: `Rebost · ${t('Tu despensa, en orden')}`, meta: [{ name: 'description', content: t('Organiza tu despensa: productos, lotes y movimientos de existencias.') }] }));
  return { locale, t, setLocale, languageError };
}
