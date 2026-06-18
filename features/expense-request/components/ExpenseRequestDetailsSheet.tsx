"use client"

import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ExpenseRequestDetails } from "../api"
import type { Policy } from "@/features/policy/api"

function formatPolicy(policy: Policy | null | undefined) {
    if (!policy) return "-"
    const version = policy.version != null ? ` (wersja ${policy.version})` : ""
    return `${policy.name}${version}`
}

function getDecisionVariant(status: string | undefined) {
    const normalized = status?.toUpperCase()
    if (normalized === "APPROVED") return "default" as const
    if (normalized === "DECLINED") return "destructive" as const
    if (normalized === "REQUIRES_ESCALATION") return "outline" as const
    return "secondary" as const
}

function getStatusLabel(status: string | null | undefined) {
    const normalized = status?.toUpperCase()
    if (normalized === "APPROVED") return "Zatwierdzony"
    if (normalized === "DECLINED") return "Odrzucony"
    if (normalized === "REQUIRES_ESCALATION") return "Wymaga eskalacji"
    if (normalized === "WAITING_FOR_APPROVAL") return "Oczekuje na decyzję"
    if (normalized === "CANCELLED") return "Anulowany"
    return status ?? "Brak"
}

function formatConflictingPolicies(policyNames: string[] | null | undefined) {
    if (!policyNames || policyNames.length === 0) return "-"
    return policyNames.join(", ")
}

type ExpenseRequestDetailsSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    details: ExpenseRequestDetails | undefined
    isLoading: boolean
    isError: boolean
    canApprove: boolean
    onApprove: (decisionRationale: string) => Promise<void>
    onDecline: (decisionRationale: string) => Promise<void>
    isApproving: boolean
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
        <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
            <span className="text-muted-foreground">{label}</span>
            <span className="min-w-0 font-medium break-all">{value}</span>
        </div>
    )
}

function ExpenseDecisionActions({
    open,
    detailsId,
    onApprove,
    onDecline,
    isApproving,
}: {
    open: boolean
    detailsId?: number
    onApprove: (decisionRationale: string) => Promise<void>
    onDecline: (decisionRationale: string) => Promise<void>
    isApproving: boolean
}) {
    const [decisionRationale, setDecisionRationale] = useState("")
    const [decisionError, setDecisionError] = useState<string | null>(null)

    useEffect(() => {
        if (!open) return
        setDecisionRationale("")
        setDecisionError(null)
    }, [open, detailsId])

    async function handleApproveClick() {
        const trimmedRationale = decisionRationale.trim()

        if (!trimmedRationale) {
            setDecisionError("Uzasadnienie decyzji jest wymagane.")
            return
        }

        try {
            setDecisionError(null)
            await onApprove(trimmedRationale)
            setDecisionRationale("")
        } catch {
            setDecisionError("Nie udało się zatwierdzić wniosku. Spróbuj ponownie.")
        }
    }

    async function handleDeclineClick() {
        const trimmedRationale = decisionRationale.trim()

        if (!trimmedRationale) {
            setDecisionError("Uzasadnienie decyzji jest wymagane.")
            return
        }

        try {
            setDecisionError(null)
            await onDecline(trimmedRationale)
            setDecisionRationale("")
        } catch {
            setDecisionError("Nie udało się odrzucić wniosku. Spróbuj ponownie.")
        }
    }

    return (
        <div className="space-y-3 py-2 text-sm">
            <p className="font-medium">Zatwierdź wniosek</p>
            <div className="space-y-2">
                <p className="text-muted-foreground">Uzasadnienie decyzji</p>
                <Textarea
                    value={decisionRationale}
                    onChange={(event) => setDecisionRationale(event.target.value)}
                    placeholder="Podaj uzasadnienie decyzji dla użytkownika..."
                    rows={4}
                    disabled={isApproving}
                />
            </div>
            {decisionError && (
                <p className="text-sm text-destructive">{decisionError}</p>
            )}
            <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={handleDeclineClick} disabled={isApproving}>
                    {isApproving ? "Przetwarzanie..." : "Odrzuć wniosek"}
                </Button>
                <Button onClick={handleApproveClick} disabled={isApproving}>
                    {isApproving ? "Zatwierdzanie..." : "Zatwierdź wniosek"}
                </Button>
            </div>
        </div>
    )
}

export function ExpenseRequestDetailsSheet({
    open,
    onOpenChange,
    details,
    isLoading,
    isError,
    canApprove,
    onApprove,
    onDecline,
    isApproving,
}: ExpenseRequestDetailsSheetProps) {
    const canApproveRequest =
        canApprove && ["WAITING_FOR_APPROVAL", "REQUIRES_ESCALATION"].includes(details?.status?.toUpperCase() ?? "")

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
                            <DetailRow label="ID" value={String(details.id)} />
                            <DetailRow label="Status" value={getStatusLabel(details.status)} />
                            <DetailRow label="Kwota" value={formatCurrency(details.amount)} />
                            <DetailRow label="Kategoria" value={details.categoryLabel} />
                            <DetailRow label="Data wydatku" value={formatDate(details.expenseDate)} />
                            <DetailRow label="Złożono" value={formatDateTime(details.submittedAt)} />
                            <Separator className="my-2" />
                            <div className="space-y-3 py-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Badge variant={getDecisionVariant(details.status)}>
                                        Decyzja managera
                                    </Badge>
                                    <span className="text-muted-foreground">{getStatusLabel(details.status)}</span>
                                </div>
                                <DetailRow
                                    label="Zastosowana polityka"
                                    value={formatPolicy(details.appliedPolicy)}
                                />
                                <DetailRow
                                    label="Konflikt polityk"
                                    value={formatConflictingPolicies(details.conflictingPolicyNames)}
                                />
                                <DetailRow
                                    label="Decyzję podjął"
                                    value={details.decidedBy ?? "-"}
                                />
                                <DetailRow
                                    label="Data decyzji"
                                    value={formatDateTime(details.decidedAt)}
                                />
                                <div className="space-y-2">
                                    <p className="text-muted-foreground">Uzasadnienie decyzji</p>
                                    <p className="rounded-md border bg-muted/20 p-3 leading-relaxed whitespace-pre-line">
                                        {details.decisionRationale ?? "Brak uzasadnienia."}
                                    </p>
                                </div>
                            </div>

                            {canApproveRequest && (
                                <>
                                    <Separator className="my-2" />
                                    <ExpenseDecisionActions
                                        key={details.id}
                                        open={open}
                                        detailsId={details.id}
                                        onApprove={onApprove}
                                        onDecline={onDecline}
                                        isApproving={isApproving}
                                    />
                                </>
                            )}

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
