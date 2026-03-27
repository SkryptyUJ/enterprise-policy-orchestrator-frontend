"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, FileText, ShieldCheck, Layers, Clock } from "lucide-react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { InputField, TextareaField } from "@/components/shared"
import { createPolicySchema, type CreatePolicyFormValues } from "../schemas/createPolicy.schema"
import { useCreatePolicy } from "../hooks/usePolicies"

const POLICY_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Pełna kontrola dostępu",
    description: "Definiuj zasady i reguły, które chronią zasoby organizacji.",
  },
  {
    icon: Layers,
    title: "Wersjonowanie",
    description: "Każda zmiana polityki tworzy nową wersję z pełną historią.",
  },
  {
    icon: Clock,
    title: "Audyt i historia",
    description: "Śledź kto i kiedy wprowadził zmiany w politykach.",
  },
]

export function CreatePolicyView() {
  const router = useRouter()
  const { mutate: createPolicy, isPending, isError, error } = useCreatePolicy()

  const form = useForm<CreatePolicyFormValues>({
    resolver: zodResolver(createPolicySchema),
    defaultValues: { name: "", description: "" },
    mode: "onTouched",
  })

  function onSubmit(values: CreatePolicyFormValues) {
    createPolicy(values, {
      onSuccess: () => router.push("/dashboard"),
    })
  }

  return (
    <div className="min-h-dvh bg-background flex">
      {/* Lewa kolumna — kontekst */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between bg-foreground text-background p-10">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-background/50 hover:text-background transition-colors mb-12"
          >
            <ArrowLeft className="size-4" />
            Wróć
          </button>

          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 rounded-lg bg-background/10 flex items-center justify-center">
              <FileText className="size-5 text-background" />
            </div>
            <span className="text-sm font-medium text-background/60 uppercase tracking-widest">
              Policy Orchestrator
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight leading-[1.1] mb-4">
            Tworzenie
            <br />
            nowej polityki
          </h1>
          <p className="text-background/50 text-base leading-relaxed">
            Polityka to zestaw reguł sterujących dostępem i zachowaniem systemu.
            Nadaj jej unikalną nazwę i opisz jej przeznaczenie.
          </p>
        </div>

        <div className="space-y-6">
          {POLICY_FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="size-8 rounded-md bg-background/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="size-4 text-background/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-background/90 mb-0.5">{title}</p>
                <p className="text-sm text-background/40 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-background/25 mt-8">
          © {new Date().getFullYear()} Policy Orchestrator
        </p>
      </div>

      {/* Prawa kolumna — formularz */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-4 border-b border-border">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Wróć
          </button>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 py-12 lg:py-0 lg:items-center">
          <div className="w-full max-w-md">
            {/* Numer kroku */}
            <div className="flex items-center gap-2 mb-8">
              <span className="size-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="text-sm text-muted-foreground">Krok 1 z 1</span>
              <div className="flex-1 h-px bg-border ml-2" />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-1">Szczegóły polityki</h2>
              <p className="text-sm text-muted-foreground">
                Wypełnij poniższe pola, aby zdefiniować nową politykę.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <InputField<CreatePolicyFormValues>
                  name="name"
                  label="Nazwa polityki"
                  placeholder="np. Polityka dostępu do danych HR"
                  icon={FileText}
                />

                <TextareaField<CreatePolicyFormValues>
                  name="description"
                  label="Opis (opcjonalny)"
                  placeholder="Opisz cel i zakres tej polityki..."
                  rows={5}
                  description="Opis pomoże innym zrozumieć przeznaczenie tej polityki."
                />

                {isError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                    <p className="text-sm text-destructive">
                      {error instanceof Error ? error.message : "Wystąpił błąd. Spróbuj ponownie."}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="flex-1"
                  >
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1"
                  >
                    {isPending ? "Zapisywanie..." : "Utwórz politykę"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
