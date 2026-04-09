"use client"

import { usePolicyVersions } from "../hooks/usePolicyVersions"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Policy } from "../api"
import { History, Search, ArrowRight, User } from "lucide-react"

function getModifiedFields(current: Policy, previous?: Policy) {
    if (!previous) return ["(Wersja początkowa - brak poprzedniej do porównania)"]
    
    const diff: string[] = []
    const keysToCheck: (keyof Policy)[] = [
        "name", "description", "startsAt", "expiresAt", "minPrice", "maxPrice", "category", "authorizedRole", "isValid"
    ]

    for (const key of keysToCheck) {
        if (current[key] !== previous[key]) {
            diff.push(`${key}: ${previous[key] ?? "brak"} → ${current[key] ?? "brak"}`)
        }
    }

    return diff.length > 0 ? diff : ["(Brak zmian w rejestrowanych polach)"]
}

export function PolicyHistoryView() {
    const params = useParams()
    // Używamy zhardkodowanego 100 jako policyId dla mocka, aby zobaczyć dane
    const policyIdStr = Array.isArray(params.policyId) ? params.policyId[0] : (params.policyId ?? "100")
    // Fallback to 100 to show some mock data if current ID doesn't match
    const policyId = parseInt(policyIdStr, 10) || 100 
    
    const { versions, allVersions, dateRange, setDateRange } = usePolicyVersions(100) // Wymuszamy 100 dla mocków

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
                                    <CardContent className="pt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1 text-muted-foreground">
                                                    <User className="size-4" /> Autor zmiany
                                                </h4>
                                                <p className="text-sm font-medium">User ID: {version.authorUserId}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Okres obowiązywania</h4>
                                                <div className="flex flex-col text-sm bg-muted/40 p-2 rounded-md">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-8 font-medium">Od:</span>
                                                        <span>{version.startsAt ? new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(version.startsAt)) : "Wyciągnięto"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-8 font-medium">Do:</span>
                                                        <span>{version.expiresAt ? new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(version.expiresAt)) : "Brak końca"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-card border rounded-md p-3 h-full overflow-y-auto">
                                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                Zmodyfikowane pola
                                            </h4>
                                            <ul className="space-y-1.5">
                                                {changes.map((change, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground flex gap-2 items-start">
                                                        <ArrowRight className="size-3.5 mt-0.5 shrink-0 text-primary" />
                                                        <span>{change}</span>
                                                    </li>
                                                ))}
                                            </ul>
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
