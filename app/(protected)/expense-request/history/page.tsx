import { ExpenseRequestHistoryView } from "@/features/expense-request/views/ExpenseRequestHistoryView"
import { AccessDenied } from "@/features/auth/components/AccessDenied"
import { RoleGuard } from "@/features/auth/components/RoleGuard"

export const metadata = {
    title: "Historia wnioskow wydatkowych - Policy Orchestrator",
}

export default function ExpenseRequestHistoryPage() {
    return (
        <RoleGuard
            allowedRoles={["employee", "manager", "compliance_officer", "admin"]}
            fallback={
                <AccessDenied description="Nie masz uprawnień do przeglądania historii wniosków." />
            }
        >
            <ExpenseRequestHistoryView />
        </RoleGuard>
    )
}
