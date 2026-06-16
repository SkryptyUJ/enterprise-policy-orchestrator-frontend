import { AccessDenied } from "@/features/auth/components/AccessDenied"
import { RoleGuard } from "@/features/auth/components/RoleGuard"
import { CategoriesManagementView } from "@/features/categories/views"

export const metadata = {
    title: "Kategorie — Policy Orchestrator",
}

export default function CategoriesPage() {
    return (
        <RoleGuard
            allowedRoles={["admin", "manager"]}
            fallback={
                <AccessDenied description="Nie masz uprawnień do zarządzania kategoriami." />
            }
        >
            <CategoriesManagementView />
        </RoleGuard>
    )
}
