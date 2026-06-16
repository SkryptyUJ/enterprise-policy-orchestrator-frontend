"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Tags, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { InputField } from "@/components/shared"
import { useCategories, useCreateCategory, useDeleteCategory } from "../hooks/useCategories"
import { createCategorySchema, type CreateCategoryFormValues } from "../schemas/category.schema"
import type { Category } from "../api"

export function CategoriesManagementView() {
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const { data: categories, isLoading, isError, isFetching } = useCategories()
    const { mutate: createCategory, isPending: isCreating, isError: isCreateError, error: createError } = useCreateCategory()
    const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()

    const form = useForm<CreateCategoryFormValues>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: { label: "" },
        mode: "onTouched",
    })

    function onSubmit(values: CreateCategoryFormValues) {
        createCategory(
            { label: values.label },
            {
                onSuccess: () => {
                    form.reset()
                    toast.success("Kategoria została dodana")
                },
                onError: () => {
                    toast.error("Nie udało się dodać kategorii")
                },
            }
        )
    }

    function handleDelete() {
        if (!categoryToDelete) return

        deleteCategory(categoryToDelete.id, {
            onSuccess: () => {
                toast.success("Kategoria została usunięta")
                setCategoryToDelete(null)
            },
            onError: () => {
                toast.error("Nie udało się usunąć kategorii")
            },
        })
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Tags className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kategorie</h1>
                        <p className="text-sm text-muted-foreground">
                            Zarządzaj kategoriami używanymi w politykach i wnioskach wydatkowych.
                        </p>
                    </div>
                </div>
                {isFetching && !isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Odświeżanie
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                <Card>
                    <CardHeader>
                        <CardTitle>Nowa kategoria</CardTitle>
                        <CardDescription>
                            Etykieta jest wyświetlana użytkownikom w formularzach.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <InputField<CreateCategoryFormValues>
                                    name="label"
                                    label="Nazwa kategorii"
                                    placeholder="np. Ergonomia"
                                    icon={Tags}
                                    disabled={isCreating}
                                />

                                {isCreateError && (
                                    <p className="text-sm text-destructive">
                                        {createError instanceof Error ? createError.message : "Wystąpił błąd. Spróbuj ponownie."}
                                    </p>
                                )}

                                <Button type="submit" disabled={isCreating} className="w-full">
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Dodawanie...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="size-4" />
                                            Dodaj kategorię
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista kategorii</CardTitle>
                        <CardDescription>
                            Usunięcie kategorii może wpłynąć na możliwość tworzenia nowych polityk i wniosków dla tej kategorii.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton key={index} className="h-14 w-full" />
                                ))}
                            </div>
                        )}

                        {isError && !isLoading && (
                            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                                Nie udało się pobrać kategorii.
                            </div>
                        )}

                        {!isLoading && !isError && categories?.length === 0 && (
                            <div className="rounded-md border bg-muted/20 p-6 text-sm text-muted-foreground">
                                Nie ma jeszcze żadnych kategorii.
                            </div>
                        )}

                        {!isLoading && !isError && Boolean(categories?.length) && (
                            <div className="divide-y rounded-md border">
                                {categories?.map((category) => (
                                    <div key={category.id} className="flex items-center justify-between gap-3 p-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{category.label}</p>
                                            <p className="text-xs text-muted-foreground">ID: {category.id}</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setCategoryToDelete(category)}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="size-4" />
                                            Usuń
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={Boolean(categoryToDelete)} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Usuń kategorię</DialogTitle>
                        <DialogDescription>
                            Ta operacja usunie kategorię „{categoryToDelete?.label}”. Nie można jej cofnąć.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>
                                Anuluj
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Usuwanie...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-4" />
                                    Usuń kategorię
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
