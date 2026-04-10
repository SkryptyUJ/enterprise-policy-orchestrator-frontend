"use client"

import { usePolicyVersions } from "../hooks/usePolicyVersions"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Policy } from "../api"
import { History, Search, ArrowRight, User, Loader2, Edit3, Calendar, AlertCircle } from "lucide-react"

const FIELD_LABELS: Partial<Record<keyof Policy, string>> = {
    name: "Nazwa",
    description: "Opis",
    startsAt: "Od",
    expiresAt: "Do",
    minPrice: "Cena min.",
    maxPrice: "Cena max.",
    category: "ID Kategorii",
    categoryId: "Kategoria",
    authorizedRole: "Rola docelowa",
    isValid: "Aktywna (Status)"
}

function getModifiedFields(current: Policy, previous?: Policy) {
    if (!previous) return []
    
    const diff: { key: string, label: string, oldVal: any, newVal: any }[] = []
    const keysToCheck: (keyof Policy)[] = [
        "name", "description", "startsAt", "expiresAt", "minPrice", "maxPrice", "category", "categoryId", "authorizedRole", "isValid"
    ]

    for (const key of keysToCheck) {
        if (current[key] !== previous[key]) {
            diff.push({
                key,
                label: FIELD_LABELS[key] || key,
                oldVal: previous[key] === null || previous[key] === undefined || previous[key] === "" ? "brak" : String(previous[key]),
                newVal: current[key] === null || current[key] === undefined || current[key] === "" ? "brak" : String(current[key])
            })
        }
    }

    return diff
}

export function PolicyHistoryView() {
    const params = useParams()
    const policyId = Array.isArray(params.policyId) ? params.policyId[0] : (params.policyId ?? "")
    
    const { versions, allVersions, dateRange, setDateRange, isLoading } = usePolicyVersions(policyId)

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                        <Search className="size-5 text-primary" />
                        Filtruj polityki po okresie obowiązywania
                    </CardTitle>
                    <CardDescription>
                        Znajdź wersje polityki aktywne w podanym przedziale czasu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="dateStart">Obowiązuje od (lub wprowadzona po)</Label>
                            <Input 
                                id="dateStart" 
                                type="date" 
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="dateEnd">Obowiązuje do (lub przed)</Label>
                            <Input 
                                id="dateEnd" 
                                type="date" 
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <button 
                                className="h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                onClick={() => setDateRange({ start: "", end: "" })}
                            >
                                Wyczyść filtry
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="relative border-l border-muted-foreground/30 ml-3 md:ml-6 pl-6 pt-4 space-y-8">
                {versions.length === 0 ? (
                    <p className="text-muted-foreground">Brak wersji spełniających kryteria.</p>
                ) : (
                    versions.map((version) => {
                        // Szukamy wersji o 1 mniejszej, a jeśli jest wyfiltrowana w 'versions',
                        // to pobieramy ją z 'allVersions' by poprawnie wyliczyć różnice.
                        const previousVersion = allVersions.find(v => (v.version || 0) === (version.version || 0) - 1)
                        const changes = getModifiedFields(version, previousVersion)

                        return (
                            <div key={version.id} className="relative">
                                {/* Oś czasu */}
                                <div className="absolute -left-[35px] top-1 h-5 w-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                </div>
                                
                                <Card className="hover:shadow-md transition-all shadow-sm border-muted">
                                    <CardHeader className="pb-3 border-b bg-muted/10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                                    Wersja {version.version}
                                                </div>
                                                <CardTitle className="text-lg">{version.name}</CardTitle>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <History className="size-4" />
                                                <span>
                                                    Zaktualizowano: {version.updatedAt ? new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(version.updatedAt)) : "brak"}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-6">
                                        {/* Parametry po zmianie (Szczegóły) */}
                                        <div className="bg-muted/20 border rounded-xl p-4">
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                                Parametry w tej wersji
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground block">Aktywna</span>
                                                    <span className="font-semibold">{version.isValid ? "Tak" : "Nie"}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground block">User ID (Autor)</span>
                                                    <span className="font-semibold">{version.authorUserId ?? "Brak"}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground block">Cena min / max</span>
                                                    <span className="font-semibold">
                                                        {version.minPrice !== null ? version.minPrice : "—"} / {version.maxPrice !== null ? version.maxPrice : "—"} PLN
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xs text-muted-foreground block">Kategoria / Rola</span>
                                                    <span className="font-semibold">
                                                        {version.category ?? "—"} / {version.authorizedRole ?? "—"}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 md:col-span-4 space-y-1">
                                                    <span className="text-xs text-muted-foreground block flex items-center gap-1.5 pt-2 border-t">
                                                        <Calendar className="size-3.5" /> Okres obowiązywania
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {version.startsAt ? new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(version.startsAt)) : "Od zawsze"}
                                                        {" — "}
                                                        {version.expiresAt ? new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(version.expiresAt)) : "Na zawsze"}
                                                    </span>
                                                </div>
                                                {version.description && (
                                                    <div className="col-span-2 md:col-span-4 space-y-1 pt-2 border-t">
                                                        <span className="text-xs text-muted-foreground block">Opis polityki</span>
                                                        <span className="font-medium text-muted-foreground italic text-sm">{version.description}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Modificiations Diffs */}
                                        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                                            <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
                                                <Edit3 className="size-4 text-primary" />
                                                <h4 className="text-sm font-semibold">Zarejestrowane modyfikacje w tej wersji</h4>
                                            </div>
                                            <div className="p-4">
                                                {!previousVersion ? (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2 italic justify-center">
                                                        <AlertCircle className="size-4" /> Wersja początkowa (utworzenie polityki)
                                                    </div>
                                                ) : changes.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground py-2 text-center">Nie wykryto bezpośrednich zmian w polach w stosunku do poprzedniej wersji.</p>
                                                ) : (
                                                    <div className="grid gap-2">
                                                        {changes.map((change) => (
                                                            <div key={change.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm p-2.5 rounded-lg border bg-background hover:bg-muted/10 transition-colors">
                                                                <span className="font-semibold text-foreground min-w-[120px]">{change.label}</span>
                                                                <div className="flex items-center gap-3 flex-1 flex-wrap">
                                                                    <span className="text-muted-foreground line-through decoration-destructive/40 bg-destructive/5 px-2 py-0.5 rounded text-xs">{change.oldVal}</span>
                                                                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                                                    <span className="font-semibold text-green-700 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-xs">{change.newVal}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
