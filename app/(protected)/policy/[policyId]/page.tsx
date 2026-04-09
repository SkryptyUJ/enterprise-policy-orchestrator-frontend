import { PolicyDetailLayout } from "@/features/policy/views/PolicyDetailLayout"

export const metadata = {
    title: "Szczegóły polityki — Policy Orchestrator",
}

interface PolicyDetailPageProps {
    params: {
        policyId: string
    }
}

export default async function PolicyDetailPage({ params }: PolicyDetailPageProps) {
    const { policyId } = await params;

    return (
        <div className="p-6 xl:p-10 min-h-full">
            <PolicyDetailLayout policyId={policyId} />
        </div>
    )
}
