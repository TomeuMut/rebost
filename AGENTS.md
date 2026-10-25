# Rebost

- Comunícate en español. Escribe commits y README en inglés.
- Rebost es una aplicación de despensa doméstica: productos, lotes y movimientos de existencias, con posibilidad de compartir por hogar.
- Stack propuesto: Nuxt, Vue, TypeScript, TailwindCSS y Supabase (PostgreSQL, Auth y Storage opcional). Despliegue web previsto en Vercel.
- Mantén el alcance inicial pequeño y cómodo desde el móvil. No añadas IA, recetas, pagos ni sincronización offline sin acordarlo.
- Separa productos, lotes y movimientos. Las entradas y salidas deben ser atómicas para evitar pérdidas de cambios entre usuarios; no permitas existencias negativas.
- Los datos pertenecen a hogares. Aplica autorización y políticas RLS por pertenencia al hogar; nunca publiques claves privilegiadas de Supabase.
- No interpretes fechas o notas del inventario como garantías de seguridad alimentaria.
- Git Flow: main para producción, develop para integración, feature/* desde develop, release/* y hotfix/* según corresponda. Integra mediante merge local con `git merge --no-ff` y push por SSH. Las pull requests son opcionales salvo solicitud expresa o protecciones de rama.
- Rebase solo en trabajo propio; no reescribas historial compartido ni hagas force push sin autorización.
- Commits locales pequeños autorizados. No push, merge, tags, despliegues ni creación de servicios externos sin indicación expresa.
- Cuando exista código, ejecuta las comprobaciones de tipos y build correspondientes y pruebas relevantes para permisos y movimientos de inventario.
- El logo y los recursos de marca quedan pendientes. No reutilices automáticamente la identidad de Tomeu Ferments.

## CI/CD

- Read `docs/ci-cd.md` before modifying the pipeline. Workflow: `.github/workflows/ci.yml`; stable jobs: **Quality** and **Build and smoke**.
- Validate with `npm ci`, `npm run lint`, `npm run check`, existing unit tests when applicable, `npm run build`, `npx playwright install chromium`, and `npm run test:smoke`. Use the Node version in `.nvmrc`.
- Run `npm test` for inventory, zone migration and translation tests. Browser smoke tests create a product, consume stock, reload, and verify inventory and language persistence. Use isolated IndexedDB contexts; never use a real household.
- Build before smoke tests. Playwright starts the built application on its own test port and checks Chromium desktop/mobile emulation with at most two workers. Failure reports and traces are retained as the `smoke-report` Actions artifact for seven days.
- Keep read-only workflow permissions, pinned official Actions, timeouts, cancellation of superseded runs and credential-free checkout. No Vercel or administrative database token is required by CI.
- After an authorized push, verify the Actions run matches the pushed commit and both jobs pass. Do not treat local tests or Vercel deployment status as proof of Actions success.
- Vercel Git integration provides deployment independently from CI. Do not claim that CI blocks production unless branch/deployment enforcement has been configured and verified separately. Do not change protections or secrets without authorization.
