import { FileText } from "lucide-react"

export const metadata = {
    title: "Wszystkie polityki — Policy Orchestrator",
}

export default function AllPoliciesPage() {
    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Wszystkie polityki</h1>
                        <p className="text-sm text-muted-foreground">Przeglądaj i zarządzaj wszystkimi politykami w systemie.</p>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-border bg-card p-8 text-center text-card-foreground">
                <p>Tu w przyszłości znajdzie się lista polityk...</p>
            </div>
        </div>
    )
}
