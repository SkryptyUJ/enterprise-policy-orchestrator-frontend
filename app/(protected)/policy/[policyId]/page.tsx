import { FileText } from "lucide-react"

export const metadata = {
    title: "Szczegóły polityki — Policy Orchestrator",
}

interface PolicyDetailPageProps {
    params: {
        policyId: string
    }
}

export default async function PolicyDetailPage({ params }: PolicyDetailPageProps) {
    // Rozwiązanie Promise'a z params (Next.js 15/16 best practices)
    const { policyId } = await params;

    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="size-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Polityka: {policyId}</h1>
                    <p className="text-sm text-muted-foreground">Szczegóły wybranej polityki dostępu.</p>
                </div>
            </div>

            <div className="rounded-md border border-border bg-card p-10 text-center text-card-foreground">
                <p>Szczegóły dla polityki ID: <span className="font-mono bg-muted px-2 py-1 rounded">{policyId}</span> zostaną załadowane tutaj.</p>
            </div>
        </div>
    )
}
