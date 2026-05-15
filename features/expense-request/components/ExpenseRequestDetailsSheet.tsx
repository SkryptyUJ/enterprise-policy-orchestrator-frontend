"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
    getExpenseRequestErrorMessage,
    type ExpenseRequest,
    type ExpenseRequestDetails,
    type ManagerDecision,
} from "../api"
import { useManagerDecision } from "../hooks/useExpenseRequests"

type ExpenseRequestDetailsSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    details: ExpenseRequestDetails | undefined
    isLoading: boolean
    isError: boolean
    error?: unknown
}

const STATUS_LABELS: Record<ExpenseRequest["status"], string> = {
    WAITING_FOR_APPROVAL: "Oczekuje na akceptację",
    ESCALATED: "Eskalowany",
    APPROVED: "Zatwierdzony",
    DECLINED: "Odrzucony",
    CANCELLED: "Anulowany",
}

const STATUS_VARIANTS: Record<ExpenseRequest["status"], "secondary" | "destructive" | "outline"> = {
    WAITING_FOR_APPROVAL: "outline",
    ESCALATED: "secondary",
    APPROVED: "secondary",
    DECLINED: "destructive",
    CANCELLED: "destructive",
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

function formatAppliedPolicy(details: ExpenseRequestDetails) {
    if (details.appliedPolicy) {
        return `${details.appliedPolicy.name} (${details.appliedPolicy.policyId})`
    }

    if (details.resolutionPolicyId !== null) {
        return String(details.resolutionPolicyId)
    }

    return "-"
}

export function ExpenseRequestDetailsSheet({
    open,
    onOpenChange,
    details,
    isLoading,
    isError,
    error,
}: ExpenseRequestDetailsSheetProps) {
    const { user } = useAuth()
    const [selectedPolicyId, setSelectedPolicyId] = useState("")
    const { mutate, isPending } = useManagerDecision(details?.id ?? null)

    const isManager = user?.roles.includes("manager") ?? false
    const isEscalated = details?.status === "ESCALATED"
    const canTakeDecision = Boolean(details && isEscalated && isManager)
    const showDecisionSummary = Boolean(
        details &&
            (details.appliedPolicy ||
                details.decidedBy ||
                details.decidedAt ||
                details.decisionRationale ||
                details.resolutionPolicyId !== null)
    )

    useEffect(() => {
        if (!details || details.conflictingPolicies.length === 0) {
            setSelectedPolicyId("")
            return
        }

        setSelectedPolicyId((current) => {
            if (current && details.conflictingPolicies.some((policy) => String(policy.id) === current)) {
                return current
            }

            return String(details.conflictingPolicies[0].id)
        })
    }, [details])

    function handleDecision(decision: ManagerDecision) {
        if (!details) {
            return
        }

        const policyId = Number(selectedPolicyId)

        if (!policyId) {
            toast.error("Wybierz politykę do rozstrzygnięcia.")
            return
        }

        mutate(
            { policyId, decision },
            {
                onSuccess: () => {
                    toast.success(decision === "APPROVE" ? "Wniosek został zatwierdzony." : "Wniosek został odrzucony.")
                },
                onError: (error) => {
                    toast.error(
                        getExpenseRequestErrorMessage(
                            error,
                            "Nie udało się zapisać decyzji managera.",
                            {
                                400: "Niepoprawna decyzja lub polityka nie przypisana do tego wniosku.",
                                403: "Tylko manager może podjąć decyzję dla eskalowanego wniosku.",
                                404: "Nie znaleziono wskazanego wniosku.",
                            }
                        )
                    )
                },
            }
        )
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Szczegóły wniosku</SheetTitle>
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
                            {getExpenseRequestErrorMessage(error, "Nie udało się pobrać szczegółów wniosku.", {
                                403: "Brak uprawnień do podglądu szczegółów wniosku.",
                                404: "Nie znaleziono wskazanego wniosku.",
                            })}
                        </p>
                    )}

                    {!isLoading && !isError && details && (
                        <div className="space-y-2">
                            <DetailRow label="ID" value={String(details.id)} />
                            <div className="grid grid-cols-[160px_1fr] gap-3 py-2 text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium break-words">
                                    <Badge variant={STATUS_VARIANTS[details.status]}>
                                        {STATUS_LABELS[details.status]}
                                    </Badge>
                                </span>
                            </div>
                            <DetailRow label="Kwota" value={formatCurrency(details.amount)} />
                            <DetailRow label="Kategoria" value={details.category} />
                            <DetailRow label="Data wydatku" value={formatDate(details.expenseDate)} />
                            <DetailRow label="Utworzono" value={formatDateTime(details.submittedAt)} />
                            <DetailRow
                                label="Polityka rozstrzygająca"
                                value={details.resolutionPolicyId !== null ? String(details.resolutionPolicyId) : "-"}
                            />

                            {showDecisionSummary && (
                                <>
                                    <Separator className="my-2" />
                                    <div className="space-y-2 py-2 text-sm">
                                        <p className="text-muted-foreground">Decyzja managera</p>
                                        <DetailRow
                                            label="Zastosowana polityka"
                                            value={formatAppliedPolicy(details)}
                                        />
                                        <DetailRow label="Decyzję podjął" value={details.decidedBy ?? "-"} />
                                        <DetailRow label="Data decyzji" value={formatDateTime(details.decidedAt)} />
                                        <div className="space-y-2">
                                            <p className="text-muted-foreground">Uzasadnienie decyzji</p>
                                            <p className="rounded-md border bg-muted/20 p-3 leading-relaxed whitespace-pre-line">
                                                {details.decisionRationale ?? "Brak uzasadnienia."}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            <Separator className="my-2" />
                            <div className="space-y-2 py-2 text-sm">
                                <p className="text-muted-foreground">Konfliktujące polityki</p>
                                {details.conflictingPolicies.length === 0 ? (
                                    <p className="rounded-md border bg-muted/20 p-3 leading-relaxed">Brak konfliktujących polityk.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {details.conflictingPolicies.map((policy) => (
                                            <div key={policy.id} className="rounded-md border bg-muted/20 p-3">
                                                <p className="font-medium">{policy.name}</p>
                                                <p className="text-xs text-muted-foreground">{policy.policyId}</p>
                                                <p className="mt-1 text-sm leading-relaxed">{policy.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {canTakeDecision && (
                                <>
                                    <Separator className="my-2" />
                                    <div className="space-y-3 py-2">
                                        <p className="text-sm font-medium">Decyzja managera</p>
                                        <div className="space-y-2">
                                            <Label htmlFor="resolutionPolicy">Wybierz politykę rozstrzygającą</Label>
                                            <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                                                <SelectTrigger id="resolutionPolicy" className="w-full">
                                                    <SelectValue placeholder="Wybierz politykę" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {details.conflictingPolicies.map((policy) => (
                                                        <SelectItem key={policy.id} value={String(policy.id)}>
                                                            {policy.name} ({policy.policyId})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                disabled={!selectedPolicyId || isPending}
                                                onClick={() => handleDecision("APPROVE")}
                                            >
                                                Zatwierdź
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                disabled={!selectedPolicyId || isPending}
                                                onClick={() => handleDecision("DECLINE")}
                                            >
                                                Odrzuć
                                            </Button>
                                        </div>
                                    </div>
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

