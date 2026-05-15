import { EditPolicyView } from "@/features/policy/views/EditPolicyView"
import { AccessDenied } from "@/features/auth/components/AccessDenied"
import { RoleGuard } from "@/features/auth/components/RoleGuard"

export const metadata = {
    title: "Edycja polityki — Policy Orchestrator",
}

interface EditPolicyPageProps {
    params: {
        policyId: string
    }
}

export default async function EditPolicyPage({ params }: EditPolicyPageProps) {
    const { policyId } = await params;

    return (
        <RoleGuard
            allowedRoles={["admin"]}
            fallback={
                <AccessDenied description="Nie masz uprawnień do edycji polityk." />
            }
        >
            <EditPolicyView policyId={policyId} />
        </RoleGuard>
    )
}
