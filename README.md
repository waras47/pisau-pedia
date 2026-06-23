# Kissaki — Japanese Knives Shop (UI Slicing)

A front-end slicing of a Japanese-kitchen-knife e-commerce homepage, built with
**Next.js (App Router) + TypeScript + Tailwind CSS**. This is **UI only** —
all product/review/navigation data is static mock data in `model/*.data.ts`
files. No backend or commerce API is wired up yet, by design.

> Brand name, copy, product names and review text are original placeholders
> written for this build — not copied from any existing site. Swap them for
> your real content whenever you're ready.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script                 | What it does                                  |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the dev server                           |
| `npm run build`         | Production build                               |
| `npm run lint`           | Run ESLint                                     |
| `npm run lint:fix`       | Run ESLint and auto-fix (incl. import order)   |
| `npm run format`        | Format the whole repo with Prettier            |
| `npm run format:check`  | Check formatting without writing               |
| `npm run typecheck`     | Run `tsc --noEmit`                             |

`npm run prepare` installs the Husky git hook automatically after `npm install`
(runs `lint-staged` on every commit, so staged files are linted + formatted
before they're committed).

## Tooling for code quality

- **ESLint** (`eslint-config-next` + `@typescript-eslint`) — catches bugs and
  enforces React/Next best practices.
- **Prettier** (+ `prettier-plugin-tailwindcss`) — consistent formatting and
  automatically sorted Tailwind classes.
- **eslint-plugin-simple-import-sort** — imports are auto-grouped in this
  order: `react/next/external` → `@/shared` → `@/entities` → `@/features` →
  `@/widgets` → `@/app` → relative imports.
- **eslint-plugin-unused-imports** — flags/removes dead imports.
- **Husky + lint-staged** — pre-commit hook so nothing unformatted/unlinted
  gets committed.

## Architecture

The codebase follows a **Feature-Sliced Design**-inspired layering, so
dependencies only ever point "downward" (no circular imports between
layers):

```
src/
├── app/        Routing only (Next.js App Router). Composes widgets.
├── widgets/    Large, page-specific composed sections
│               (Header, Footer, Hero, Testimonials, ...).
├── features/   Self-contained interactive behavior
│               (theme-toggle, newsletter-signup).
├── entities/   Domain models + the UI bound to them
│               (product, review, navigation) — model/ + ui/.
└── shared/     Framework-agnostic, reusable building blocks
                (ui primitives, the cn() helper, site config, icons).
```

**Rule of thumb:** `app` → `widgets` → `features` → `entities` → `shared`.
A layer may import from itself or any layer below it, never above. This keeps
each widget swappable/removable without breaking unrelated parts of the page,
and keeps "dumb" UI (shared/ui) decoupled from business/domain data
(entities).

Every domain folder (e.g. `entities/product`) is self-contained:

```
entities/product/
├── model/        types + static data (swap for an API call later)
├── lib/          domain-specific helpers (e.g. price formatting)
├── ui/           components bound to this domain (ProductCard, etc.)
└── index.ts      the only file other layers should import from
```

### Path aliases

`@/*` maps to `src/*` (see `tsconfig.json`), so imports read as
`@/entities/product`, `@/shared/ui/Button`, `@/widgets/header`, etc. instead
of relative `../../../` chains.

## Theming (light default, dark mode available)

Dark mode uses [`next-themes`](https://github.com/pacocoursey/next-themes)
with Tailwind's `class` strategy:

- Defaults to **light mode** for every visitor (`defaultTheme="light"`,
  `enableSystem={false}` in `features/theme-toggle/lib/ThemeProvider.tsx`).
- Toggled via the sun/moon icon in the header
  (`features/theme-toggle/ui/ThemeToggle.tsx`), which persists the choice in
  `localStorage`.
- All colors are CSS variables defined in `src/app/globals.css` under `:root`
  (light) and `.dark` (dark), consumed through Tailwind tokens
  (`bg-background`, `text-foreground`, `bg-accent`, `text-copper`, ...) in
  `tailwind.config.ts` — components never hardcode hex values.

## Images

There is no real product photography yet, so every image slot renders
`shared/ui/PlaceholderImage.tsx` (a styled gradient block with a label).
Replace these with `next/image` once real assets/CDN are available — the
prop shape (`ratio`, `label`) is meant to make that swap a find-and-replace.

## What's intentionally not built yet

- No commerce/CMS API integration (per the brief — slicing first).
- No cart/checkout logic — the cart icon is static (count is hardcoded to 0).
- No product detail / collection pages — `ProductCard` links to
  `/products/[slug]`, which will 404 until those routes are built.
- No real auth — the account icon is decorative for now.

## Next steps (when you're ready to wire up data)

1. Replace the arrays in `entities/*/model/*.data.ts` with `fetch`/SDK calls
   (keep the same `Product` / `Review` / `NavItem` shapes and the rest of the
   UI keeps working unchanged).
2. Add `app/products/[slug]/page.tsx` and `app/collections/[handle]/page.tsx`.
3. Swap `PlaceholderImage` for `next/image` wherever real assets exist.
4. Wire `NewsletterForm`'s `handleSubmit` to your email provider.
