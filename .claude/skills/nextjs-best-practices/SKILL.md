---
name: nextjs-best-practices
description: This skill should be used when the user asks to write, review, or refactor code in this project. Provides best practices for Next.js 16 (App Router), React 19, client-side data fetching with TanStack React Query, and SOLID/KISS/DRY principles. Activate for any feature development, component creation, hook writing, or API layer work.
version: 1.0.0
---

# Next.js 16 + React 19 Best Practices

## Next.js 16 — App Router

### Server vs Client Components
- Domyślnie wszystkie komponenty w `app/` są **Server Components** — nie używają stanu, hooków ani event handlerów
- Dodaj `"use client"` **tylko** gdy komponent potrzebuje: hooków (`useState`, `useEffect`), event handlerów, React Query, kontekstu
- Trzymaj `"use client"` jak najniżej w drzewie — ogranicz boundary do małych, interaktywnych liści

```tsx
// Dobry podział: Server Component opakowuje Client Component
// app/features/policy/views/PolicyView.tsx (Server)
export default async function PolicyView() {
  return <PolicyList /> // Client Component niżej
}

// features/policy/components/PolicyList.tsx (Client)
"use client"
export function PolicyList() {
  const { data } = usePolicies()
  ...
}
```

### Routing i Views
- Strony (`app/foo/page.tsx`) powinny być cienką warstwą — delegują do `features/<name>/views/`
- Layouts (`layout.tsx`) nie fetchują danych — służą do struktury UI i providerów

```tsx
// app/policy/page.tsx
import { PolicyView } from "@/features/policy/views"
export default function Page() {
  return <PolicyView />
}
```

### Metadata
- Eksportuj `metadata` lub `generateMetadata` z `page.tsx`, nie z komponentów

---

## React 19

### Hooks
- Używaj `use()` do odczytu Promise i kontekstu warunkowo (React 19 feature)
- `useOptimistic` do optymistycznych aktualizacji UI

### Refs
- W React 19 `ref` to zwykły prop — nie potrzebujesz `forwardRef`

```tsx
// React 19 — bez forwardRef
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

### Unikaj
- Nie owijaj wszystkiego w `memo`, `useCallback`, `useMemo` z góry — profiluj najpierw
- Nie używaj `useEffect` do fetchowania danych — użyj React Query

---

## TanStack React Query v5 — Client-Side Fetching

### Struktura w features
Każdy feature ma swój layer API w `features/<name>/api/` i hooki w `features/<name>/hooks/`.

```
features/policy/
├── api/
│   └── index.ts       # Funkcje fetch (nie hooki)
└── hooks/
    └── usePolicies.ts  # useQuery / useMutation
```

### API layer — czyste funkcje fetch

```ts
// features/policy/api/index.ts
export async function fetchPolicies(): Promise<Policy[]> {
  const res = await fetch("/api/policies")
  if (!res.ok) throw new Error("Failed to fetch policies")
  return res.json()
}

export async function createPolicy(data: CreatePolicyDto): Promise<Policy> {
  const res = await fetch("/api/policies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create policy")
  return res.json()
}
```

### Hooks layer — React Query

```ts
// features/policy/hooks/usePolicies.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPolicies, createPolicy } from "../api"

export const policyKeys = {
  all: ["policies"] as const,
  detail: (id: string) => ["policies", id] as const,
}

export function usePolicies() {
  return useQuery({
    queryKey: policyKeys.all,
    queryFn: fetchPolicies,
  })
}

export function useCreatePolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.all })
    },
  })
}
```

### Query Keys
- Używaj obiektu `*Keys` per feature — centralizuje klucze i ułatwia invalidację
- Klucze powinny być hierarchiczne: `["policies"]`, `["policies", id]`

### Zasady React Query
- Nie fetchuj w `useEffect` — używaj `useQuery`
- Nie przechowuj danych z serwera w `useState` — React Query to cache
- `staleTime` ustaw gdy dane rzadko się zmieniają (np. `staleTime: 5 * 60 * 1000`)
- Invaliduj po mutacji — nie aktualizuj cache ręcznie (chyba że optymistycznie)

---

## Loading States — Obsługa Ładowania

### useQuery — stany ładowania

React Query dostarcza `isLoading` i `isFetching` — używaj ich do pokazywania loaderów.

```tsx
"use client"

export function PolicyList() {
  const { data: policies, isLoading, isFetching } = usePolicies()

  if (isLoading) return <Spinner /> // pierwsze ładowanie, brak danych w cache

  return (
    <div className="relative">
      {isFetching && <div className="absolute top-2 right-2"><Spinner size="sm" /></div>}
      <ul>{policies?.map(p => <PolicyItem key={p.id} policy={p} />)}</ul>
    </div>
  )
}
```

- `isLoading` — `true` tylko przy pierwszym fetchu (brak danych w cache) → pokazuj skeleton/spinner blokujący
- `isFetching` — `true` przy każdym fetchu (w tym refetch) → pokazuj subtelny indicator

### useMutation — loading podczas wysyłania

```tsx
export function CreatePolicyForm() {
  const { mutate, isPending } = useCreatePolicy()

  return (
    <form onSubmit={handleSubmit}>
      {/* ... pola formularza ... */}
      <Button type="submit" disabled={isPending}>
        {isPending ? <Spinner size="sm" /> : "Zapisz"}
      </Button>
    </form>
  )
}
```

- `isPending` — `true` gdy mutacja jest w toku → blokuj przycisk, pokaż spinner w buttonie

### Skeleton zamiast spinnera dla list/kart

Dla danych strukturalnych (listy, karty) preferuj skeleton nad spinnerem — mniejszy layout shift:

```tsx
if (isLoading) {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />
      ))}
    </div>
  )
}
```

### Zasady loaderów
- Zawsze obsługuj `isLoading` — nigdy nie renderuj pustej listy bez informacji dla użytkownika
- Blokuj przyciski submit podczas `isPending` mutacji — zapobiegaj podwójnemu wysłaniu
- Używaj `disabled` na interaktywnych elementach podczas ładowania

---

## SOLID

### Single Responsibility
Każdy plik/moduł ma jeden powód do zmiany:
- Komponent renderuje UI — nie fetchuje, nie transformuje danych
- Hook zarządza stanem/danymi — nie renderuje JSX
- Funkcja w `utils/` robi jedną rzecz

```tsx
// Zle: komponent fetchuje i renderuje
function PolicyList() {
  const [policies, setPolicies] = useState([])
  useEffect(() => { fetch(...).then(setPolicies) }, [])
  return <ul>{policies.map(...)}</ul>
}

// Dobrze: rozdzielone warstwy
function PolicyList() {
  const { data: policies } = usePolicies() // hook z api/hooks
  return <ul>{policies?.map(p => <PolicyItem key={p.id} policy={p} />)}</ul>
}
```

### Open/Closed
Komponenty rozszerzalne przez props, nie przez modyfikację:
```tsx
// Zle: hardcoded wariant w środku
function Button() {
  if (type === "danger") return <button className="bg-red-500">...</button>
}

// Dobrze: wariant przez props (shadcn CVA pattern)
const buttonVariants = cva("...", {
  variants: { variant: { default: "...", destructive: "..." } }
})
```

### Liskov Substitution
Komponenty przyjmujące `children` lub callback props nie powinny zakładać konkretnego kształtu — używaj generyków lub dobrze zdefiniowanych interfejsów.

### Interface Segregation
Nie przekazuj do komponentu całego obiektu gdy potrzebuje tylko 2 pól:
```tsx
// Zle
<PolicyCard policy={fullPolicyObject} />

// Dobrze
<PolicyCard title={policy.title} status={policy.status} />
```

### Dependency Inversion
Komponenty zależą od abstrakcji (props, hooki), nie od konkretnych implementacji:
```tsx
// Hook jako abstrakcja — komponent nie wie skąd dane
function PolicyView() {
  const { data } = usePolicies() // może być REST, GraphQL, mock
}
```

---

## KISS (Keep It Simple, Stupid)

- Nie twórz abstrakcji dopóki nie masz ≥3 miejsc użycia
- Preferuj jawność nad sprytnością — długi ale czytelny kod > krótki ale zagadkowy
- Nie generalizuj przedwcześnie — rozwiąż konkretny problem, nie hipotetyczny
- Jeden hook, jedna odpowiedzialność — nie łącz niepowiązanej logiki

```tsx
// Zle: "universal" hook robiący za dużo
function useFeature(config) { ... }

// Dobrze: prosty, konkretny hook
function usePolicies() { ... }
function usePolicyDetail(id: string) { ... }
```

---

## DRY (Don't Repeat Yourself)

### Kiedy tworzyć abstrakcję
Duplikacja jest OK przy pierwszym i drugim użyciu. Przy trzecim — rozważ ekstrakcję.

### Gdzie wyciągać
| Duplikacja | Gdzie wyciągnąć |
|---|---|
| Logika fetchowania | `features/<name>/api/` |
| Logika stanu/efektów | `features/<name>/hooks/` lub `lib/` |
| Transformacje danych | `features/<name>/utils/` |
| Fragment UI | `components/shared/` lub `features/<name>/components/` |
| Style/klasy | `cva()` variant lub Tailwind `@apply` (rzadko) |

### Utility `cn()`
Zawsze używaj `cn()` z `lib/utils.ts` do łączenia klas Tailwind:
```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class", className)} />
```

---

## Struktura Komponentu — Szablon

```tsx
"use client" // tylko jeśli potrzebne

import { ... } from "@/..."

// Typy na górze
interface PolicyCardProps {
  title: string
  status: "active" | "inactive"
  className?: string
}

// Komponent — jeden export default LUB named export
export function PolicyCard({ title, status, className }: PolicyCardProps) {
  // 1. Hooki
  const { mutate } = useUpdatePolicy()

  // 2. Handlery
  function handleClick() { ... }

  // 3. Render
  return (
    <div className={cn("...", className)}>
      ...
    </div>
  )
}
```

---

## Czego Unikać

| Anty-pattern | Zamiast tego |
|---|---|
| `useEffect` do fetchowania | `useQuery` z React Query |
| `useState` dla danych z serwera | React Query cache |
| Fetch bezpośrednio w komponencie | Warstwa `api/` + hook |
| Ogromne komponenty (>150 linii) | Rozbij na mniejsze |
| Prop drilling >2 poziomy | Context lub Zustand |
| `any` w TypeScript | Zdefiniuj typ |
| Inline style | Tailwind klasy |
| Hardcoded stringi | Stałe lub i18n |
