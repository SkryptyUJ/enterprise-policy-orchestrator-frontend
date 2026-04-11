"use client"

import Link from "next/link"
import { CheckCircle2, XCircle, Eye, CalendarOff, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAllPolicies } from "../hooks/usePolicies"

function isPolicyActive(policy: { isValid: boolean | null; startsAt: string | null; expiresAt: string | null }) {
    const now = new Date()
    if (!policy.isValid) return false
    if (policy.startsAt && new Date(policy.startsAt) > now) return false
    if (policy.expiresAt && new Date(policy.expiresAt) <= now) return false
    return true
}

function formatDate(dateStr: string | null) {
    if (!dateStr) return "—"
    return new Intl.DateTimeFormat("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateStr))
}

export function PolicyList() {
    const { data: policies, isLoading, isError } = useAllPolicies()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center">
                <p className="text-sm text-destructive">Nie udało się pobrać listy polityk.</p>
            </div>
        )
    }

    if (!policies || policies.length === 0) {
        return (
            <div className="rounded-md border border-border bg-card p-8 text-center text-card-foreground">
                <p>Brak polityk w systemie.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nazwa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Obowiązuje od</TableHead>
                        <TableHead>Wygasa</TableHead>
                        <TableHead>Widełki cenowe</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {policies.map((policy) => {
                        const active = isPolicyActive(policy)
                        return (
                            <TableRow key={policy.id} className={!active ? "opacity-60" : undefined}>
                                <TableCell className="font-medium">{policy.name}</TableCell>
                                <TableCell>
                                    {active ? (
                                        <Badge variant="default" className="gap-1">
                                            <CheckCircle2 className="size-3" />
                                            Aktywna
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1">
                                            {policy.expiresAt && new Date(policy.expiresAt) <= new Date() ? (
                                                <>
                                                    <CalendarOff className="size-3" />
                                                    Wygasła
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="size-3" />
                                                    Nieaktywna
                                                </>
                                            )}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>{formatDate(policy.startsAt)}</TableCell>
                                <TableCell>{formatDate(policy.expiresAt)}</TableCell>
                                <TableCell>
                                    {policy.minPrice !== null || policy.maxPrice !== null
                                        ? `${policy.minPrice ?? "—"} – ${policy.maxPrice ?? "—"} zł`
                                        : "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/policy/${policy.id}`}>
                                            <Eye className="size-4 mr-1" />
                                            Szczegóły
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
