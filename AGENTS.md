# Rebost

- Comunícate en español. Escribe commits y README en inglés.
- Rebost es una aplicación de despensa doméstica: productos, lotes y movimientos de existencias, con posibilidad de compartir por hogar.
- Stack propuesto: Nuxt, Vue, TypeScript, TailwindCSS y Supabase (PostgreSQL, Auth y Storage opcional). Despliegue web previsto en Vercel.
- Mantén el alcance inicial pequeño y cómodo desde el móvil. No añadas IA, recetas, pagos ni sincronización offline sin acordarlo.
- Separa productos, lotes y movimientos. Las entradas y salidas deben ser atómicas para evitar pérdidas de cambios entre usuarios; no permitas existencias negativas.
- Los datos pertenecen a hogares. Aplica autorización y políticas RLS por pertenencia al hogar; nunca publiques claves privilegiadas de Supabase.
- No interpretes fechas o notas del inventario como garantías de seguridad alimentaria.
- Git Flow: main para producción, develop para integración, feature/* desde develop, release/* y hotfix/* según corresponda. Integra mediante pull request.
- Rebase solo en trabajo propio; no reescribas historial compartido ni hagas force push sin autorización.
- Commits locales pequeños autorizados. No push, merge, tags, despliegues ni creación de servicios externos sin indicación expresa.
- Cuando exista código, ejecuta las comprobaciones de tipos y build correspondientes y pruebas relevantes para permisos y movimientos de inventario.
- El logo y los recursos de marca quedan pendientes. No reutilices automáticamente la identidad de Tomeu Ferments.
