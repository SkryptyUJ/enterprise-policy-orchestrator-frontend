import { CreateExpenseRequestView } from "@/features/expense-request/views/CreateExpenseRequestView"
import { AccessDenied } from "@/features/auth/components/AccessDenied"
import { RoleGuard } from "@/features/auth/components/RoleGuard"

export const metadata = {
    title: "Nowy wniosek wydatkowy — Policy Orchestrator",
}

export default function ExpenseRequestNewPage() {
    return (
        <RoleGuard
            allowedRoles={["employee", "admin"]}
            fallback={
                <AccessDenied description="Tylko użytkownicy z uprawnieniem do tworzenia wniosków mogą otworzyć ten widok." />
            }
        >
            <CreateExpenseRequestView />
        </RoleGuard>
    )
}
