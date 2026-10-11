# Rebost

A simple household pantry app for keeping track of preserves, ferments, and other stored food. Know what you have, how much is left, and where it is stored.

**Example:** you have 5 jars of crushed tomatoes. Add a new batch of 3 jars to reach 8; record using one jar to leave 7. Keep the batches separate while showing the total for the product.

## Proposed stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Web application | Nuxt, Vue, TypeScript | Responsive interface and application structure |
| Styling | TailwindCSS | Consistent, mobile-first design |
| Database | Supabase PostgreSQL | Products, batches, stock movements, and household membership |
| Authentication | Supabase Auth | User accounts and access to shared household pantries |
| Photos, if needed | Supabase Storage | Optional product and batch images |
| Web hosting | Vercel | Preview and production deployments |

The initial plan uses one web codebase with Supabase providing managed data and authentication. Server-side operations or PostgreSQL functions will handle inventory changes that require transactions. The app does not need a separate Laravel API to validate the first version.

## First version

- Sign in and create a household pantry, with a data model that supports sharing with other members.
- Add products with a name, category, storage location, and unit such as jars, bottles, or bags.
- Record batches with a quantity and optional preparation date and notes.
- Quickly add stock, record consumption, or correct a count.
- Show product totals across batches and a simple history of changes.
- Search and filter the inventory from a phone or desktop.

Adding and consuming stock should take only a few taps. Optional fields should not slow down everyday use.

## Core model

| Entity | Responsibility |
| --- | --- |
| Household | The shared pantry and its storage locations |
| Membership | Which users can access a household |
| Product | What is stored, its category, and its stock unit |
| Batch | A particular lot of a product, with its location and optional dates and notes |
| Stock movement | An addition, consumption, or correction linked to a batch and the person recording it |

A product can have several batches. Five jars prepared in August and three prepared in September appear as eight jars in total, without losing their separate histories. Use one stock unit per product initially; package sizes and unit conversions can come later.

Inventory changes must be atomic, prevent negative quantities, and avoid duplicate submissions. Corrections should leave an understandable history. Household membership and database row-level security must protect every household's data, including any stored photos. Privileged Supabase keys must stay on the server.

Dates and notes are user-entered inventory information, not food-safety assessments or automatically calculated safe-consumption periods.

## Later possibilities

After validating the basic workflow: low-stock indicators, user-entered reminder dates, exports, QR labels, and installation as a progressive web app. Offline editing and conflict resolution are a separate phase; an installable interface does not automatically provide offline synchronization.

AI features, recipe management, payments, and complex shopping workflows are outside the first version.

## Project status

This repository currently documents the concept and proposed stack. The application, Supabase project, and Vercel deployment have not been created. Branding and the logo are pending. The project is independent of Tomeu Ferments and does not automatically reuse its visual identity.

Planned implementation order:

1. Agree on the main screens and everyday inventory workflow.
2. Establish the Nuxt, TypeScript, and TailwindCSS application.
3. Design database migrations, household access policies, and atomic stock operations.
4. Implement product, batch, and movement screens.
5. Validate permissions, concurrent changes, mobile usability, and production builds.
6. Prepare preview deployment and review before publishing.

Local setup instructions will be added when the application scaffold exists.

## Git workflow

Use `main` for production and `develop` for integration. Create `feature/*` branches from `develop` and integrate through pull requests. Prepare releases in `release/*`, tag released versions with annotated SemVer tags, and synchronize production changes back into `develop`. Start urgent production fixes in `hotfix/*`.

Rebase only private working history. Commit messages and README content must be in English. Pushes, merges, tags, external service provisioning, and deployments require explicit authorization. See `AGENTS.md` for repository working agreements.
