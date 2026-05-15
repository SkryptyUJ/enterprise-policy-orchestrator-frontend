import { CreatePolicyView } from "@/features/policy/views/CreatePolicyView"
import { AccessDenied } from "@/features/auth/components/AccessDenied"
import { RoleGuard } from "@/features/auth/components/RoleGuard"

export const metadata = {
    title: "Nowa polityka — Policy Orchestrator",
}

export default function NewPolicyPage() {
    return (
        <RoleGuard
            allowedRoles={["admin"]}
            fallback={
                <AccessDenied description="Nie masz uprawnień do tworzenia polityk." />
            }
        >
            <CreatePolicyView />
        </RoleGuard>
    )
}
