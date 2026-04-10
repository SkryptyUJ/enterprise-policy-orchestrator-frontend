"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, History, Calendar, DollarSign, Tag, CheckCircle2, Shield, Loader2, Info, Pencil } from "lucide-react"
import { PolicyHistoryView } from "./PolicyHistoryView"
import { usePolicyDetail } from "../hooks/usePolicies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PolicyDetailLayoutProps {
    policyId: string
}

export function PolicyDetailLayout({ policyId }: PolicyDetailLayoutProps) {
    const [showHistory, setShowHistory] = useState(false)
    const { data: currentPolicy, isLoading, isError } = usePolicyDetail(policyId)

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-destructive/10 p-3">
                    <Info className="size-6 text-destructive" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Nie udało się pobrać polityki</h2>
                    <p className="mt-1 text-muted-foreground border-destructive/30 bg-destructive/5 px-4 py-3 rounded-lg flex gap-3 text-sm text-destructive">
                        Sprawdź, czy polityka istnieje lub odśwież stronę.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={`grid grid-cols-1 ${showHistory ? 'xl:grid-cols-2' : 'max-w-4xl mx-auto'} gap-8 items-start transition-all duration-300`}>
            {/* Lewa kolumna: Informacje o polityce */}
            <div className="space-y-6 sticky top-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="size-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Polityka: {policyId}</h1>
                            <p className="text-sm text-muted-foreground">Aktualne szczegóły polityki dostępu.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setShowHistory(!showHistory)}
                            variant={showHistory ? "secondary" : "outline"}
                            className="gap-2 shrink-0 transition-all"
                        >
                            <History className="size-4" />
                            {showHistory ? "Ukryj historię" : "Zobacz historię"}
                        </Button>
                        <Link href={`/policy/${policyId}/edit`} passHref>
                            <Button className="gap-2 shrink-0 transition-all">
                                <Pencil className="size-4" />
                                Edytuj
                            </Button>
                        </Link>
                    </div>
                </div>

                {currentPolicy ? (
                    <Card className="border-muted shadow-sm">
                        <CardHeader className="bg-muted/10 border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                                        Wersja {currentPolicy.version}
                                    </div>
                                    <CardTitle className="text-xl">{currentPolicy.name}</CardTitle>
                                </div>
                                {currentPolicy.isValid && (
                                    <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <CheckCircle2 className="size-3.5" /> Aktywna
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-1">Opis</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{currentPolicy.description || "Brak opisu"}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 bg-muted/30 p-3.5 rounded-xl border border-muted/50">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        <Calendar className="size-3.5" /> Okres obowiązywania
                                    </div>
                                    <div className="text-sm font-medium">
                                        {currentPolicy.startsAt ? new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(currentPolicy.startsAt)) : "Od teraz"}
                                        {" — "}
                                        {currentPolicy.expiresAt ? new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(currentPolicy.expiresAt)) : "Zawsze"}
                                    </div>
                                </div>

                                <div className="space-y-1.5 bg-muted/30 p-3.5 rounded-xl border border-muted/50">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        <DollarSign className="size-3.5" /> Widełki cenowe
                                    </div>
                                    <div className="text-sm font-medium">
                                        {currentPolicy.minPrice !== null ? `${currentPolicy.minPrice} zł` : "Brak"}
                                        {" — "}
                                        {currentPolicy.maxPrice !== null ? `${currentPolicy.maxPrice} zł` : "Brak"}
                                    </div>
                                </div>

                                <div className="space-y-1.5 bg-muted/30 p-3.5 rounded-xl border border-muted/50">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        <Tag className="size-3.5" /> Kategoria
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-background rounded border text-xs">ID: {currentPolicy.category || "Brak"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5 bg-muted/30 p-3.5 rounded-xl border border-muted/50">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        <Shield className="size-3.5" /> Wymagana rola
                                    </div>
                                    <div className="text-sm font-medium flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-background rounded border text-xs">ID: {currentPolicy.authorizedRole || "Brak"}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            Nie znaleziono takich danych dla polityki {policyId}.
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Prawa kolumna: Historia */}
            <div className={`transition-all duration-500 ease-in-out origin-left ${showHistory ? 'opacity-100 scale-100 block' : 'opacity-0 scale-95 hidden'}`}>
                {showHistory && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
                            <History className="size-5" /> Historia modyfikacji
                        </h2>
                        <PolicyHistoryView />
                    </div>
                )}
            </div>
        </div>
    )
}
