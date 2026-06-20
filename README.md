# SharpEdge Shop

Premium knife e-commerce storefront built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, and a clean, modular architecture. This is a **UI-only mockup** — no backend or API integration yet.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Architecture](#project-architecture)
3. [Folder Structure](#folder-structure)
4. [Design System](#design-system)
5. [Development Setup](#development-setup)
6. [Available Scripts](#available-scripts)
7. [Code Quality Tools](#code-quality-tools)
8. [Component Guide](#component-guide)
9. [Data Layer](#data-layer)
10. [Roadmap — API Integration](#roadmap--api-integration)
11. [Conventions & Rules](#conventions--rules)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.x (App Router) | React framework, routing, SSR/SSG |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Static typing |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Lucide React** | latest | Icon library |
| **clsx** | 2.x | Conditional class names |
| **tailwind-merge** | 3.x | Merge conflicting Tailwind classes |
| **ESLint** | 9.x | Code linting (flat config) |
| **Prettier** | 3.x | Code formatting |

---

## Project Architecture

The codebase follows a **layered, modular architecture**:

```
User Interface (Pages)
       ↓
  Sections (page-level blocks)
       ↓
  UI Components (reusable atoms/molecules)
       ↓
  Data Layer (mock data / future: API)
       ↓
  Types & Utilities
```

### Key Principles

- **Co-location**: Each folder has an index.ts barrel export for clean imports
- **No business logic in components**: Components only render; data fetching goes in page/server components
- **Single responsibility**: Each component does one thing well
- **Type safety first**: All data shapes defined as TypeScript interfaces in src/types/

---

## Folder Structure

```
sharp-edge-shop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (Header + Footer + fonts)
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles & CSS variables
│   │   └── shop/
│   │       └── page.tsx        # Shop/catalog page
│   │
│   ├── components/
│   │   ├── ui/                 # Atomic / reusable UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/             # Structural layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── sections/           # Page-level section components
│   │       ├── HeroSection.tsx
│   │       ├── CategoriesSection.tsx
│   │       ├── FeaturedProductsSection.tsx
│   │       ├── BrandsSection.tsx
│   │       ├── FeaturesSection.tsx
│   │       ├── TestimonialsSection.tsx
│   │       ├── CtaBannerSection.tsx
│   │       └── index.ts
│   │
│   ├── data/
│   │   └── index.ts            # Mock data (products, categories, brands, nav)
│   │
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn, formatPrice, etc.)
│   │
│   └── types/
│       └── index.ts            # All TypeScript interfaces & types
│
├── public/images/              # Static assets
├── eslint.config.mjs
├── .prettierrc
├── .prettierignore
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

### Color Palette

| Name | Hex | Usage |
|---|---|---|
| Gold | #C9A84C | Primary accent, CTAs, highlights |
| Gold Muted | #B8963E | Hover state for gold |
| Background | #0A0A0A | Main page background |
| Surface | #111111 | Cards, overlays |
| Border | #1E1E1E | Dividers, card borders |
| Text Primary | #FFFFFF | Headings, key labels |
| Text Muted | #888888 | Body text, descriptions |

### Typography

- Display/Headings: Geist Sans, font-light (300), tracked tight
- Body: Geist Sans, font-normal (400)
- Labels/Eyebrows: text-xs, uppercase, tracking-[0.2em]
- Buttons: uppercase, tracking-wider, font-semibold

---

## Development Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-org/sharp-edge-shop.git
cd sharp-edge-shop

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Environment Variables (future)

```env
NEXT_PUBLIC_API_URL=https://api.sharpedgeshop.com
NEXT_PUBLIC_STRIPE_KEY=pk_...
SHOPIFY_STOREFRONT_TOKEN=...
```

---

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without writing
npm run type-check   # TypeScript check (no emit)
```

---

## Code Quality Tools

### ESLint

Uses Next.js flat config with extra rules:
- no-unused-vars: warn
- no-explicit-any: warn
- prefer-const: error
- no-console: warn (allow warn/error)
- react/self-closing-comp: warn

### Prettier

- singleQuote: true
- semi: true
- tabWidth: 2
- printWidth: 100
- Plugins: prettier-plugin-tailwindcss, @trivago/prettier-plugin-sort-imports

### TypeScript

- strict: true
- Path alias: @/* -> ./src/*

---

## Component Guide

### Button

```tsx
<Button variant="primary" size="lg">Shop Now</Button>
<Button variant="outline">Learn More</Button>
<Button variant="ghost">Cancel</Button>
```

Props: variant (primary|secondary|ghost|outline), size (sm|md|lg), fullWidth

### Badge

```tsx
<Badge variant="gold">Best Seller</Badge>
<Badge variant="red">Sale</Badge>
<Badge variant="green">New</Badge>
```

### ProductCard

```tsx
<ProductCard product={product} />
```

### StarRating

```tsx
<StarRating rating={4.7} reviewCount={342} size="md" />
```

### SectionHeading

```tsx
<SectionHeading
  eyebrow="Shop by Type"
  title="Find Your Blade"
  subtitle="Optional subtitle."
  align="center"
/>
```

---

## Data Layer

All data is static mock data in src/data/index.ts.

| Export | Type | Description |
|---|---|---|
| PRODUCTS | Product[] | All mock products |
| CATEGORIES | Category[] | Knife categories |
| BRANDS | Brand[] | Premium brands |
| NAV_ITEMS | NavItem[] | Navigation tree |
| TESTIMONIALS | Testimonial[] | Customer reviews |
| FEATURED_PRODUCTS | Product[] | Filtered: isFeatured === true |
| NEW_ARRIVALS | Product[] | Filtered: isNew === true |

---

## Roadmap — API Integration

### Phase 1 — Data Layer

Replace mock data with server-side fetching:

```
src/lib/api/
├── products.ts     # fetchProducts, fetchProductBySlug
├── categories.ts
└── brands.ts
```

### Phase 2 — Commerce Features

- Cart state (Zustand or React Context)
- Shopify Storefront API or custom backend
- Stripe payments
- Authentication (NextAuth.js)

### Phase 3 — CMS

- Contentful or Sanity for product/blog content

---

## Conventions & Rules

### Naming

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | ProductCard.tsx |
| Hooks | camelCase, use prefix | useCart.ts |
| Types | PascalCase | Product, Category |
| Constants | SCREAMING_SNAKE_CASE | PRODUCTS, NAV_ITEMS |

### Component Rules

- Server Components by default; add 'use client' only for interactivity
- One component per file
- Props interface defined above component
- Barrel exports via index.ts

### Git Commits (recommended)

```
feat: add product detail page
fix: correct mobile nav z-index
style: format all files with prettier
docs: update README
```
