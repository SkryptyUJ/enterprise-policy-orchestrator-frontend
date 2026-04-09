"use client"

import { useRouter } from "next/navigation"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, FileText, ShieldCheck, Layers, Clock, Info, Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { InputField, TextareaField } from "@/components/shared"
import { createPolicySchema, type CreatePolicyFormValues } from "../schemas/createPolicy.schema"
import { usePolicyDetail, useUpdatePolicy } from "../hooks/usePolicies"

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

interface EditPolicyViewProps {
    policyId: number
}

export function EditPolicyView({ policyId }: EditPolicyViewProps) {
    const router = useRouter()

    const { data: policy, isLoading: isFetching, isError: isFetchError } = usePolicyDetail(policyId)

    const { mutate: updatePolicy, isPending, isError, error } = useUpdatePolicy(policyId)

    const form = useForm<CreatePolicyFormValues>({
        resolver: zodResolver(createPolicySchema) as unknown as Resolver<CreatePolicyFormValues>,
        defaultValues: { name: "", description: "" } as never,
        mode: "onTouched",
    })


    useEffect(() => {
        if (policy) {
            form.reset({
                name: policy.name || "",
                description: policy.description || "",
                categoryId: policy.categoryId || undefined,
                category: policy.category || undefined,
                authorizedRole: policy.authorizedRole || undefined,
                minPrice: policy.minPrice || undefined,
                maxPrice: policy.maxPrice || undefined,
                startsAt: policy.startsAt ? new Date(policy.startsAt).toISOString().slice(0, 16) : undefined,
                expiresAt: policy.expiresAt ? new Date(policy.expiresAt).toISOString().slice(0, 16) : undefined,
            })
        }
    }, [policy, form])

    function onSubmit(values: CreatePolicyFormValues) {
        updatePolicy(values, {
            onSuccess: () => router.push("/dashboard"),
        })
    }

    if (isFetching) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isFetchError || !policy) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-destructive/10 p-3">
                    <Info className="size-6 text-destructive" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Nie udało się pobrać polityki</h2>
                    <p className="mt-1 text-muted-foreground border-destructive/30 bg-destructive/5 px-4 py-3 rounded-lg flex gap-3 text-sm text-destructive">
                        Sprawdź, czy masz do niej dostęp lub spróbuj ponownie.
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>
                    Wróć
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6 md:p-10">
            {/* Header i powrót */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <div className="flex items-center justify-center size-8 rounded-full bg-background border shadow-sm">
                        <ArrowLeft className="size-4" />
                    </div>
                    Wróć do listy
                </button>

                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="size-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edycja polityki</h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Wprowadź zmiany w polityce: <span className="font-medium text-foreground">{policy.name}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Kolumna lewa — formularz */}
                <div className="lg:col-span-7 xl:col-span-8 bg-card border rounded-2xl shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="size-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                            1
                        </span>
                        <span className="text-sm font-medium text-foreground">Edycja szczegółów</span>
                        <div className="flex-1 h-px bg-border ml-2" />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-6">
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
                                rows={3}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField<CreatePolicyFormValues>
                                    name="minPrice"
                                    type="number"
                                    label="Cena minimalna"
                                    placeholder="np. 100"
                                />
                                <InputField<CreatePolicyFormValues>
                                    name="maxPrice"
                                    type="number"
                                    label="Cena maksymalna"
                                    placeholder="np. 5000"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField<CreatePolicyFormValues>
                                    name="categoryId"
                                    type="number"
                                    label="ID Kategorii"
                                    placeholder="np. 1"
                                />
                                <InputField<CreatePolicyFormValues>
                                    name="category"
                                    type="number"
                                    label="Kategoria"
                                    placeholder="np. 1"
                                />
                                <InputField<CreatePolicyFormValues>
                                    name="authorizedRole"
                                    type="number"
                                    label="ID Roli autoryzacyjnej"
                                    placeholder="np. 2"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField<CreatePolicyFormValues>
                                    name="startsAt"
                                    type="datetime-local"
                                    label="Data rozpoczęcia (opcjonalnie)"
                                />
                                <InputField<CreatePolicyFormValues>
                                    name="expiresAt"
                                    type="datetime-local"
                                    label="Data wygaśnięcia (opcjonalnie)"
                                />
                            </div>

                            {isError && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 flex gap-3">
                                    <Info className="size-5 text-destructive shrink-0 mt-0.5" />
                                    <p className="text-sm text-destructive">
                                        {error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji."}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isPending}
                                    className="px-8"
                                >
                                    Anuluj
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 px-8"
                                >
                                    {isPending ? "Zapisywanie..." : "Zapisz zmiany"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Kolumna prawa — informacje dodatkowe */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
                    <div className="bg-muted/50 border rounded-2xl p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            <Info className="size-4" />
                            Kluczowe funkcje
                        </div>

                        <div className="space-y-6">
                            {POLICY_FEATURES.map(({ icon: Icon, title, description }) => (
                                <div key={title} className="flex gap-4 group">
                                    <div className="size-10 rounded-lg bg-background border flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                                        <Icon className="size-5 text-foreground/70" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
