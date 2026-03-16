# CLAUDE.md

## Project Overview

**Policy Orchestrator** — frontend aplikacji webowej budowanej w Next.js 16 z React 19.

Język UI: **polski** (`<html lang="pl">`)

## Tech Stack

### Core
- **Next.js** 16.1.6 — framework (App Router, RSC enabled)
- **React** 19.2.3
- **TypeScript** 5 (strict mode)

### Styling
- **Tailwind CSS** v4 (`@tailwindcss/postcss`)
- **shadcn/ui** — komponenty UI (styl: `radix-nova`, kolory: `neutral`)
- **tw-animate-css** — animacje
- **tailwind-merge** + **clsx** + **class-variance-authority** — narzędzia do klas

### UI Components
- **Radix UI** `^1.4.3` — prymitywy komponentów
- **Lucide React** — ikony
- Gotowe komponenty w `components/ui/` (generowane przez shadcn CLI)

### Data Fetching
- **TanStack React Query** v5 — server state management
- Provider skonfigurowany w `providers/tanstackQuery/index.tsx`, owinięty wokół aplikacji w `app/layout.tsx`

### Auth
- **Auth0** — autoryzacja i uwierzytelnianie

## Folder Structure

```
frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (TanstackQueryProvider tutaj)
│   ├── page.tsx                # Strona główna
│   └── globals.css             # Globalne style + Tailwind + theme variables
│
├── components/
│   ├── ui/                     # Komponenty shadcn (button, input, ...)
│   └── shared/                 # Współdzielone komponenty własne
│
├── features/                   # Feature-based architecture
│   └── <feature-name>/
│       ├── api/                # Funkcje API / fetching
│       ├── components/         # Komponenty specyficzne dla feature
│       ├── hooks/              # Custom hooks
│       ├── utils/              # Helpery/utilsy
│       └── views/              # Widoki / page-level komponenty
│
├── providers/
│   └── tanstackQuery/          # React Query provider
│
├── lib/
│   └── utils.ts                # Globalne utility (cn(), itp.)
│
├── public/                     # Statyczne zasoby
├── next.config.ts
├── tsconfig.json               # Path alias: @/* → root
├── components.json             # Konfiguracja shadcn
└── postcss.config.mjs
```

## Architecture Conventions

### Feature-based structure
Każda nowa funkcjonalność tworzona jest jako osobny moduł w `features/`. Struktura wewnętrzna każdego feature:
- `api/` — funkcje do komunikacji z backendem (np. używające React Query)
- `components/` — komponenty UI specyficzne dla tej funkcji
- `hooks/` — custom hooks (np. `useQuery`, `useMutation` dla tej funkcji)
- `utils/` — funkcje pomocnicze
- `views/` — kompletne widoki/strony przekazywane do App Router

### Komponenty
- Komponenty shadcn trafiają do `components/ui/` (generuj przez `npx shadcn add <component>`)
- Komponenty współdzielone między features trafiają do `components/shared/`

### Import alias
Używaj `@/` zamiast ścieżek względnych:
```ts
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Theming
- Kolory zdefiniowane jako CSS custom properties w `app/globals.css` (przestrzeń barw OKLch)
- Dark mode obsługiwany przez zmienne CSS
- Używaj Tailwind semantic color tokens (np. `bg-primary`, `text-foreground`)

## Code Style

- Nie dodawaj komentarzy do kodu, chyba że użytkownik o to poprosi.

## Dev Commands

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint
```

## Adding shadcn Components

```bash
npx shadcn add <component-name>
```

Komponenty trafiają automatycznie do `components/ui/`.
