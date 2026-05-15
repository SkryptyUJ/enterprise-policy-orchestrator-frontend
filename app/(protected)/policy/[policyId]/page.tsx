import { PolicyDetailLayout } from "@/features/policy/views/PolicyDetailLayout"
import { AccessDenied } from "@/features/auth/components/AccessDenied"
import { RoleGuard } from "@/features/auth/components/RoleGuard"

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
        <RoleGuard
            allowedRoles={["employee", "manager", "compliance_officer", "admin"]}
            fallback={
                <AccessDenied description="Nie masz uprawnień do podglądu szczegółów polityki." />
            }
        >
            <div className="p-6 xl:p-10 min-h-full">
                <PolicyDetailLayout policyId={policyId} />
            </div>
        </RoleGuard>
    )
}
