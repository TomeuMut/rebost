# Rebost

A small household pantry app for tracking preserves, ferments, and everyday food reserves. Know what you have, how much is left, and where it is stored.

**Example:** five jars of crushed tomatoes plus a new batch of three gives eight jars. Record using one jar and seven remain, with both batches and the movement history preserved.

## Stack

| Layer | First version | Planned shared version |
| --- | --- | --- |
| Application | Nuxt, Vue, TypeScript | Same |
| Styling | TailwindCSS and Phosphor icons | Same |
| Data | IndexedDB in the current browser | Supabase PostgreSQL |
| Accounts and households | One local pantry, no sign-in | Supabase Auth and household memberships |
| Hosting | Static output, ready for Vercel | Vercel web application with Supabase |

This first version is a working local prototype, not the shared Supabase application yet. No external service has been provisioned, and there is no fake login or cloud synchronization. The interface supports Spanish, English, and Catalan. The initial wordmark is a placeholder; the final logo is pending.

## Try it locally

Use Node.js 22.12 or later within the Node 22 LTS line.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3002/. The initial pantry is empty. Add a product or choose **Probar con un ejemplo** to load explicitly labeled sample data. While using the sample pantry, **Empezar mi despensa** opens a confirmation before removing those sample records and any edits made to them.

```sh
npm run check
npm test
npm run build
npm run preview
```

The build generates static files in `.output/public`. `vercel.json` provides the build configuration. No secrets or environment variables are needed for the local version.

## Available features

- Create products with a category and stock unit: jars, bottles, bags, or units.
- Choose product icons for containers and foods, including jars, bottles, tomatoes, vegetables, fruit, grains, and herbs. Automatic mode suggests an icon from the product name or unit; existing products work without a data migration. Change a saved product's icon from its detail view.
- Start with zero stock or create the first batch in the same transaction as the product.
- Add separate batches with a name, location, optional preparation date, and notes.
- Add stock to an existing batch or record consumption.
- Correct a batch to its actual quantity with a required reason and an auditable delta.
- View each product's total and individual batch balances, including exhausted batches.
- Search products and filter by category, location, or stock availability.
- Browse and search the history of additions, consumption, and corrections.
- Persist changes across page reloads and refresh other open tabs in the same browser.
- Switch between ES, EN, and CA, with a saved language preference and localized dates, labels, and notices.
- Create custom storage zones, such as Pantry 1 or Store room 2, from the Zones view or while adding a batch. Select them in batch forms and inventory filters.

Product names, custom zone names, batch names, and personal notes stay as entered when changing language. The initial Pantry, Fridge, and Freezer zones have translated labels. Existing local inventories are migrated automatically to the zone model without deleting products, batches, or movement history. Adding a zone does not change stock quantities.

Dates and notes are inventory information, not food-safety assessments. The app does not calculate safe-consumption periods.

## Data and correctness

Products, batches, and stock movements are separate entities. Balances are calculated from movements rather than storing an independently editable counter. Quantities must be whole numbers; each batch is limited to one million units. Consumption cannot create negative stock. Corrections require a reason and remain in the history.

IndexedDB read/write transactions read the latest committed state and save each operation atomically. A product and its initial batch are saved together. Multiple tabs share the same database; transactions serialize changes, BroadcastChannel refreshes supported browsers, and returning to a tab also reloads its state. These mechanisms do not synchronize across devices or different browsers. Save errors are reported and successful state is only shown after the transaction commits.

Local data belongs to this browser profile and origin. Clearing site data or using another browser/device will not preserve or reveal this pantry. This prototype has no export or backup feature yet and should not be treated as a cloud backup.

## Source map

- `src/domain/pantry.ts`: pure inventory rules and sample data.
- `src/domain/product-icons.ts`: available product icons and automatic suggestions.
- `app/components/ProductIcon.vue`: Phosphor icons and a matching tomato SVG.
- `app/components/LlenguesPattern.vue`: decorative background using the supplied photograph of blue Mallorcan llengües fabric. Change `--textile-image`, `--textile-size`, and `--textile-opacity` in `src/styles/global.css` to adjust the fabric, scale, and intensity. The supplied red (`/Tela-roja.jpg`) and black (`/tela-negra.jpg`) alternatives are also available in `public`.
- `app/composables/usePantry.ts`: IndexedDB transactions, persistence, and tab updates.
- `app/composables/useLanguage.ts`: language preference and localized page metadata.
- `src/i18n/messages.ts`: Spanish, English, and Catalan interface messages.
- `app/app.vue`: inventory, product and batch dialogs, movement forms, and history.
- `src/styles/global.css`: semantic theme variables, TailwindCSS, and responsive layout.
- `tests/pantry.test.mjs`: stock integrity and validation tests.
- `tests/zones.test.mjs` and `tests/languages.test.mjs`: custom zones, legacy migration, and translation coverage.

## Next phase

Connect the same product/batch/movement model to Supabase. Add user accounts, household memberships, database migrations, row-level security policies, and server-side or PostgreSQL operations for atomic stock changes. All household access and any later photo storage must be authorized through membership; privileged keys must never reach the browser. Add tests for member/non-member access and concurrent inventory updates before enabling shared use.

Photo uploads, exports, reminders, QR labels, installability, and offline synchronization are future decisions. Recipe management, payments, and AI are outside the initial scope.

## Git Flow

Use `main` for production, `develop` for integration, and `feature/*` branches from `develop` for changes reviewed through pull requests. Prepare releases in `release/*`, use annotated SemVer tags, and synchronize releases back into `develop`. Urgent production fixes start in `hotfix/*`. Rebase only private working history.

Commit messages and README content are in English. Pushes, merges, tags, service provisioning, and deployment require explicit authorization. Repository agreements are in `AGENTS.md`.
