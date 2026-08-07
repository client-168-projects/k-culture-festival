# CLAUDE.md

# Project Philosophy

This project prioritizes maintainability, scalability, performance, accessibility, and consistency over quick implementations.

Always think before coding.

Before implementing any feature, ask:

- Can an existing component be reused?
- Can an existing hook be reused?
- Can an existing utility be reused?
- Can an existing type be reused?
- Can an existing style be reused?

Always prefer extending existing implementations over creating new ones.

---

# Response Rules

- Keep responses concise.
- Do not explain obvious code.
- Do not generate unnecessary comments.
- Do not use emojis.
- Do not rewrite entire files unless requested.
- Show only modified files when possible.
- Avoid repeating previous explanations.
- Output production-ready code only.

---

# General Principles

Follow:

- DRY
- KISS
- SOLID
- Composition over inheritance

Always write code that is:

- readable
- maintainable
- scalable
- reusable

Avoid premature optimization.

Never duplicate business logic.

---

# Architecture

Use modern Next.js App Router architecture.

Prefer:

- Server Components
- Server Actions
- Route Handlers
- Streaming
- Suspense

Use Client Components only when necessary.

Keep page.tsx and layout.tsx lightweight.

Business logic should never live inside pages.

---

# Folder Structure

Use feature-based architecture.

```
app/(site)/       - public festival pages, wrapped with SiteHeader/SiteFooter
app/admin/         - admin panel (login + sidebar-protected pages), no public chrome
app/api/admin/     - admin-only route handlers (notices CRUD, auth)
features/
components/
components/ui/
components/admin/  - admin-only components (not reused by the public site)
hooks/
stores/
services/
lib/
types/
constants/
styles/
db/                - D1 schema.sql
scripts/           - one-off ops scripts (e.g. create-admin)
```

Keep related files together.

---

# Project Conventions

Once a project convention has been established:

Never introduce

- another folder structure
- another naming convention
- another state management approach
- another styling solution
- another architecture pattern

without explicit instruction.

Consistency is more important than personal preference.

---

# Components

Always build reusable components.

Before creating a component:

1. Search for an existing one.
2. Search for a similar one.
3. Extend it if possible.

Avoid one-off components.

Every component should have one responsibility.

Separate

- UI
- business logic
- state

whenever possible.

Pages should assemble existing components instead of implementing UI directly.

Preferred hierarchy:

```
Page
  → Feature
      → Section
          → Component
              → Primitive UI
```

---

# UI Design

Use modern minimal design.

Prioritize:

- whitespace
- typography
- visual hierarchy
- consistency
- subtle shadows
- soft borders
- rounded corners
- responsive layouts

Avoid:

- excessive gradients
- inconsistent spacing
- unnecessary borders
- decorative animations

---

# Design System

Create reusable UI primitives.

Examples:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Badge
- Avatar
- Card
- Dialog
- Modal
- Drawer
- Sheet
- Tabs
- Accordion
- Dropdown
- Tooltip
- Skeleton
- Spinner

Never recreate existing UI patterns.

---

# Design Tokens

This is a public festival site — the audience skews wider than a typical web app, including older visitors. Legibility and touch-target size are treated as default requirements, not an edge case to special-case later.

Typography scale (defined once in `src/app/globals.css` under `@theme`, as `--text-*` — this overrides Tailwind's default scale, so every existing `text-sm` / `text-base` / etc. utility across the app already uses it):

| Token | Size | Line height | Typical use |
| --- | --- | --- | --- |
| `text-xs` | 13px | 18px | Fine print only (badges, timestamps) |
| `text-sm` | 15px | 22px | Secondary text, labels |
| `text-base` | 17px | 26px | Body copy, form inputs (site default) |
| `text-lg` | 19px | 28px | Emphasized body text |
| `text-xl` | 21px | 30px | Section subheadings |
| `text-2xl` | 26px | 34px | Page headings |
| `text-3xl` | 32px | 38px | Hero / primary heading |

Rules:

- Never hardcode a font size (`style={{ fontSize }}`, arbitrary Tailwind values like `text-[14px]`). Always use a scale token.
- Body copy and form inputs default to `text-base` (17px), not `text-sm`. `text-sm`/`text-xs` are for secondary/tertiary text only, never for primary reading content.
- Don't introduce a size outside this scale for "just this one component." If the scale doesn't have what you need, that's a signal to reconsider the hierarchy, not to reach for an arbitrary value.
- Interactive targets (buttons, inputs, icon buttons) use `h-10`/`size-10` as the default, `h-9` as the small variant — kept intentionally close to the WCAG 44px-ish comfortable touch-target range rather than shrinking further for density.

Color tokens (defined in `src/app/globals.css`, light values in `:root`, dark overrides in `.dark`): `background`/`foreground`, `card`/`card-foreground`, `popover`/`popover-foreground`, `primary`/`primary-foreground`, `secondary`/`secondary-foreground`, `muted`/`muted-foreground`, `accent`/`accent-foreground`, `destructive`/`destructive-foreground`, `border`, `input`, `ring`.

- Always use the semantic token (`bg-background`, `text-muted-foreground`, `border-border`, ...), never a raw hex/rgb/oklch value or a Tailwind palette color (`bg-gray-100`, `text-zinc-500`) directly in a component.
- Adding a new token means adding it to both `:root` and `.dark`, and wiring it through the `@theme inline` block — not inventing a one-off CSS variable locally.

---

# UX Principles

Optimize for perceived performance.

Always:

- keep interactions responsive
- minimize layout shift
- preserve scroll position
- provide instant feedback
- avoid blocking the UI

Use optimistic updates when appropriate.

Handle:

- loading
- empty
- error
- success

states gracefully.

---

# Loading Experience

Prefer:

Skeletons > Spinners

Skeletons should:

- resemble the final layout
- be reusable
- be shared components

Use Suspense boundaries whenever appropriate.

Avoid flashing loading indicators.

---

# User Feedback

Every user interaction should provide feedback.

Examples:

- loading
- success
- error
- disabled
- retry

Never leave users wondering what happened.

---

# Animation

Animations should improve UX.

Use animation only for:

- page transitions
- modal transitions
- hover
- focus
- expand/collapse
- loading

Avoid decorative animations.

Keep durations under 300ms.

---

# Responsive Design

Always build mobile-first.

Support:

- Mobile
- Tablet
- Desktop

Never design desktop-only layouts.

Mobile and responsive behavior is never a follow-up pass. Implement it in the same change as the feature or UI itself, not as a separate later task.

Every new component, page, or layout change must be verified at mobile, tablet, and desktop widths before it is considered done.

Concretely, for every UI change:

- Use responsive utility variants (`sm:`, `md:`, `lg:`) for spacing, typography, and layout instead of fixed values that only look right on desktop.
- Prefer fluid/flex/grid layouts over fixed widths.
- Re-check touch target size, text wrapping, and horizontal overflow at narrow widths (320–375px).
- Any interactive desktop-only pattern (hover menus, mega menus, multi-column layouts) must have an explicit, equally usable mobile equivalent — not just a hidden/cramped version of the desktop UI.

---

# TailwindCSS

Use TailwindCSS utilities.

Avoid repeating utility combinations.

Extract reusable UI patterns.

Prefer semantic design tokens.

Use CSS variables for:

- colors
- spacing
- radius
- shadows
- typography

Never hardcode colors repeatedly.

---

# State Management

Server State

- Prefer Server Components
- Prefer fetch caching
- Prefer Server Actions
- Revalidate when appropriate

Client State

- Prefer Zustand
- Keep global state minimal
- Keep local state local

Never store server data inside Zustand.

Avoid unnecessary Context providers.

---

# Data Fetching

Server-first.

Fetch on the server whenever possible.

Avoid unnecessary client requests.

Use:

- cache
- revalidate
- streaming
- suspense

appropriately.

---

# Language

This site is Korean-only. There is no i18n/locale infrastructure — do not reintroduce one (no `next-intl`, no `[locale]` route segment, no message/translation files). Write all user-facing text directly in components, in Korean.

Fallback pages

- `app/loading.tsx`, `app/not-found.tsx`, `app/error.tsx` reuse the shared design system (`Skeleton`, `Card`, `Button`, etc.) and render inside the root layout normally.
- `app/global-error.tsx` is the one exception: it's a last-resort fallback that renders its own `<html>/<body>` (it replaces the root layout when the root layout itself throws). Keep it dependency-free and hardcoded — it must work even if the theme provider itself fails.

---

# TypeScript

Strict mode.

Never use:

- any
- @ts-ignore

Prefer:

- inferred types
- shared types
- utility types

Use type unless interface extension is required.

---

# API Layer

Separate API logic from UI.

Never fetch directly inside reusable UI components.

Keep API implementations centralized.

Handle errors consistently.

---

# Admin & Data (D1)

Full setup/operations guide: see `DATABASE.md`.

- D1 is accessed only through `src/lib/d1.ts` (Cloudflare REST API over `fetch`), never via a native Workers binding. This project deploys to both Cloudflare Pages and a plain Node.js host (Raspberry Pi via pm2); native bindings only work on Cloudflare, so REST API is the one approach that works identically everywhere.
- Server Component pages call `getNotices()` (`src/lib/notices.ts`) or `d1Query()` directly — never fetch D1 from the client.
- `d1Query` throws on failure. Read paths used during page render must catch and fall back to `[]` (see `getNotices`) so a missing/misconfigured D1 never breaks a build or crashes a page. Write paths (the `/api/admin/*` route handlers) must also catch D1 errors and return a clean JSON `{ error }` response — never let one bubble into Next's default error page.
- Auth is a custom HMAC-signed session cookie (`src/lib/auth.ts`), verified in `src/proxy.ts` for every `/admin/*` and `/api/admin/*` request. It uses only Web Crypto (`crypto.subtle`) — no Node-only crypto, no auth library — so the same code runs on Cloudflare's edge runtime and on the Pi's Node.js.
- Never use `bcrypt`/Node's `crypto` module for anything under `src/lib/auth.ts` or `src/proxy.ts` — it breaks portability across the two runtimes.
- Passwords are never stored or logged in plaintext. Use `scripts/create-admin.mjs` to create/reset admin accounts (it hashes with the exact same PBKDF2 params as `src/lib/auth.ts`).
- Any HTML saved from the rich editor must go through `sanitizeNoticeContent()` (`src/lib/sanitize.ts`) before it's written to D1. Content already in D1 is trusted and rendered with `dangerouslySetInnerHTML` — sanitize on write, not on read.
- Admin CRUD is modal-only (`src/components/admin/notice-dialog.tsx`) — no per-item detail route. Don't add one without discussing it first; the public site is the only place notice content gets its own page-level view (and even there it's an inline expand, not a route).
- Every mutation (`POST`/`PUT`/`DELETE` under `/api/admin/notices`) must call `revalidatePath` for both `/community/notice` and `/admin/notices` so the public page and the admin list stay in sync without a full rebuild.

---

# Performance

Optimize for real user experience.

Prefer:

- lazy loading
- dynamic imports
- code splitting
- image optimization
- font optimization
- bundle reduction

Avoid unnecessary:

- re-renders
- useMemo
- useCallback

Only optimize after identifying a real bottleneck.

---

# Forms

Use:

- React Hook Form
- Zod

Share validation schemas.

---

# Accessibility

Always use:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible contrast

Use ARIA only when necessary.

---

# SEO

Every page should consider SEO.

Use:

- Metadata API
- Dynamic Metadata
- OpenGraph
- Twitter Cards
- robots.txt
- sitemap.xml
- canonical URLs
- semantic HTML
- structured data (JSON-LD) when appropriate

---

# Naming

Components

PascalCase

Hooks

useSomething

Types

PascalCase

Constants

UPPER_SNAKE_CASE

Variables

camelCase

---

# Imports

Prefer absolute imports.

Group imports consistently.

Avoid deep relative paths.

---

# Dependencies

Never introduce a new dependency if the current stack can solve the problem.

Always prefer existing project libraries.

Avoid unnecessary packages.

---

# Refactoring

Whenever modifying code:

- remove dead code
- remove unused imports
- reduce complexity
- improve readability
- improve reusability

Leave the codebase cleaner than before.

---

# Quality Checklist

Before completing any implementation, verify:

- No duplicated code
- Reusable components are used
- Reusable hooks are used
- No unnecessary Client Components
- No unnecessary global state
- No unnecessary Context
- No unnecessary effects
- No unnecessary props
- Strong TypeScript types
- Responsive layout
- Accessible UI
- SEO preserved
- Loading state implemented
- Empty state implemented
- Error state implemented
- Success feedback implemented
- Optimistic updates considered
- Skeleton loading considered
- Performance considered
- Production-ready quality