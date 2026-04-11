"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { ExpenseRequestDetails } from "../api"

type ExpenseRequestDetailsSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    details: ExpenseRequestDetails | undefined
    isLoading: boolean
    isError: boolean
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-"
    return new Date(value).toLocaleDateString("pl-PL")
}

function formatDateTime(value: string | null | undefined) {
    if (!value) return "-"
    return new Date(value).toLocaleString("pl-PL")
}

function formatCurrency(value: number | null | undefined) {
    if (typeof value !== "number") return "-"
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(value)
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[160px_1fr] gap-3 py-2 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium break-words">{value}</span>
        </div>
    )
}

export function ExpenseRequestDetailsSheet({
    open,
    onOpenChange,
    details,
    isLoading,
    isError,
}: ExpenseRequestDetailsSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Szczegoly wniosku</SheetTitle>
                    <SheetDescription>
                        Informacje o wybranym wniosku wydatkowym.
                    </SheetDescription>
                </SheetHeader>

                <div className="px-4 pb-4">
                    {isLoading && (
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    )}

                    {isError && !isLoading && (
                        <p className="text-sm text-destructive">
                            Nie udalo sie pobrac szczegolow wniosku.
                        </p>
                    )}

                    {!isLoading && !isError && details && (
                        <div>
                            <DetailRow label="ID" value={details.id} />
                            <DetailRow label="Status" value={details.status ?? "Brak"} />
                            <DetailRow label="Kwota" value={formatCurrency(details.amount)} />
                            <DetailRow label="Kategoria" value={details.category} />
                            <DetailRow label="Data wydatku" value={formatDate(details.expenseDate)} />
                            <DetailRow label="Utworzono" value={formatDateTime(details.createdAt)} />
                            <DetailRow label="Zaktualizowano" value={formatDateTime(details.updatedAt)} />
                            <DetailRow label="Zatwierdzono" value={formatDateTime(details.approvedAt)} />
                            <DetailRow label="Odrzucono" value={formatDateTime(details.rejectedAt)} />
                            <Separator className="my-2" />
                            <DetailRow
                                label="Powod odrzucenia"
                                value={details.rejectionReason ?? "-"}
                            />
                            <Separator className="my-2" />
                            <div className="space-y-2 py-2 text-sm">
                                <p className="text-muted-foreground">Opis</p>
                                <p className="rounded-md border bg-muted/20 p-3 leading-relaxed">
                                    {details.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

