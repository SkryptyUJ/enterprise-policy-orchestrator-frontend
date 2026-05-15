---
name: form-builder
description: Use this skill when the user asks to create, review, or refactor forms in this project. Provides senior-level patterns for React Hook Form + shadcn/ui + Zod + React Query mutations. Activate for any form creation, form component work, or validation logic.
version: 1.0.0
---

# Formularze — React Hook Form + shadcn/ui + Zod + React Query

## Stack

- **react-hook-form** + **zod** + **@hookform/resolvers/zod**
- **shadcn/ui** (`Form`, `Button`)
- **`InputField`** i **`SelectField`** z `@/components/shared` — ZAWSZE używaj tych komponentów zamiast pisać `FormField` ręcznie
- **React Query `useMutation`** do wysyłania

---

## Reużywalne komponenty pól

Projekt ma gotowe generyczne komponenty w `components/shared/`:

- `InputField` — dla wszystkich pól tekstowych, numerycznych, date, password itp.
- `SelectField` — dla pól select z listą opcji
- `TextareaField` — dla pól wieloliniowych (TEXT w bazie)

Wszystkie używają `useFormContext()` — działają tylko wewnątrz `<Form>`.

```tsx
import { InputField, SelectField, TextareaField } from "@/components/shared"
```

### InputField — props

| Prop | Typ | Opis |
|---|---|---|
| `name` | `Path<T>` | Nazwa pola (type-safe) |
| `label` | `string?` | Etykieta nad polem |
| `placeholder` | `string?` | Placeholder |
| `type` | `HTMLInputTypeAttribute?` | Domyślnie `"text"` |
| `description` | `string?` | Podpis pod polem |
| `disabled` | `boolean?` | |
| `icon` | `LucideIcon?` | Ikona po lewej stronie inputa |
| `step` | `string?` | Dla `type="number"` |

### SelectField — props

| Prop | Typ | Opis |
|---|---|---|
| `name` | `Path<T>` | Nazwa pola (type-safe) |
| `options` | `SelectOption[]` | `{ label: string, value: string }[]` |
| `label` | `string?` | Etykieta |
| `placeholder` | `string?` | Domyślnie `"Wybierz..."` |
| `description` | `string?` | |
| `disabled` | `boolean?` | |

---

## Struktura plików

```
features/<name>/
├── api/index.ts
├── hooks/use<Name>Mutation.ts
├── components/<Name>Form.tsx
└── schemas/<name>.schema.ts
```

---

## 1. Schema Zod

```ts
// features/policy/schemas/createPolicy.schema.ts
import { z } from "zod"

export const createPolicySchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  type: z.enum(["standard", "premium"], { required_error: "Wybierz typ" }),
  value: z.coerce.number().positive("Wartość musi być większa od 0"),
})

export type CreatePolicyFormValues = z.infer<typeof createPolicySchema>
```

- `z.coerce.number()` dla pól numerycznych — input zawsze zwraca string
- `z.infer<typeof schema>` jako typ — nie duplikuj ręcznie

---

## 2. Hook mutacji

```ts
// features/policy/hooks/useCreatePolicyMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPolicy } from "../api"
import { policyKeys } from "./usePolicies"
import type { CreatePolicyFormValues } from "../schemas/createPolicy.schema"

export function useCreatePolicyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePolicyFormValues) => createPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.all })
    },
  })
}
```

---

## 3. Komponent formularza

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { InputField, SelectField } from "@/components/shared"
import { createPolicySchema, type CreatePolicyFormValues } from "../schemas/createPolicy.schema"
import { useCreatePolicyMutation } from "../hooks/useCreatePolicyMutation"

const TYPE_OPTIONS = [
  { label: "Standardowa", value: "standard" },
  { label: "Premium", value: "premium" },
]

export function CreatePolicyForm() {
  const { mutate, isPending, isError, error } = useCreatePolicyMutation()

  const form = useForm<CreatePolicyFormValues>({
    resolver: zodResolver(createPolicySchema),
    defaultValues: { name: "", type: undefined, value: 0 },
    mode: "onTouched",
  })

  function onSubmit(values: CreatePolicyFormValues) {
    mutate(values, { onSuccess: () => form.reset() })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <InputField<CreatePolicyFormValues>
          name="name"
          label="Nazwa polisy"
          placeholder="Wpisz nazwę..."
          icon={Building2}
        />

        <SelectField<CreatePolicyFormValues>
          name="type"
          label="Typ polisy"
          options={TYPE_OPTIONS}
        />

        <InputField<CreatePolicyFormValues>
          name="value"
          label="Wartość"
          type="number"
          step="0.01"
        />

        {isError && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Wystąpił błąd. Spróbuj ponownie."}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Zapisywanie..." : "Zapisz"}
        </Button>

      </form>
    </Form>
  )
}
```

---

## 4. Formularz edycji

```tsx
useEffect(() => {
  if (data) form.reset({ name: data.name, type: data.type, value: data.value })
}, [data, form])
```

Skeleton podczas ładowania:

```tsx
function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-11 w-full rounded-md bg-muted animate-pulse" />
        </div>
      ))}
      <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
    </div>
  )
}
```

---

## 5. Pola tablicowe (useFieldArray)

```tsx
const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" })

{fields.map((field, index) => (
  <div key={field.id} className="flex gap-2 items-end">
    <InputField name={`items.${index}.name`} label={`Pozycja ${index + 1}`} />
    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
))}
<Button type="button" variant="outline" onClick={() => append({ name: "" })}>
  Dodaj pozycję
</Button>
```

---

## Zasady

| | |
|---|---|
| Zawsze `InputField` / `SelectField` | Nigdy nie pisz `FormField` boilerplate ręcznie |
| Zawsze `zodResolver` | Nie waliduj ręcznie w RHF |
| `mode: "onTouched"` | Walidacja po dotknięciu pola |
| `form.reset()` po sukcesie | W `onSuccess` callbacku mutacji |
| `disabled={isPending}` | Blokuj submit podczas wysyłania |
| Błąd mutacji przed buttonem | `isError` jako `<p className="text-destructive">` |
