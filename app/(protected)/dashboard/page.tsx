import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AccessDenied } from "@/features/auth/components/AccessDenied"
import { RoleGuard } from "@/features/auth/components/RoleGuard"

export const metadata = {
    title: "Dashboard — Policy Orchestrator",
}

export default function DashboardPage() {
    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <div className="flex gap-2">
                    <RoleGuard allowedRoles={["employee", "admin"]}>
                        <Button asChild>
                            <Link href="/expense-request/new">Nowy wniosek wydatkowy</Link>
                        </Button>
                    </RoleGuard>
                    <RoleGuard allowedRoles={["employee", "manager", "compliance_officer", "admin"]}>
                        <Button asChild>
                            <Link href="/expense-request/history">Historia wnioskow</Link>
                        </Button>
                    </RoleGuard>
                    <RoleGuard allowedRoles={["admin"]}>
                        <Button asChild>
                            <Link href="/policy/new">Nowa polityka</Link>
                        </Button>
                    </RoleGuard>
                    <Button asChild>
                        <Link href="/auth/logout">Wyloguj</Link>
                    </Button>
                </div>
            </div>
            <RoleGuard
                allowedRoles={["employee", "manager", "compliance_officer", "admin"]}
                fallback={
                    <AccessDenied description="Nie masz jeszcze żadnych uprawnień przypisanych do dashboardu." />
                }
            >
                <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                    Wybierz sekcję z menu po lewej stronie.
                </div>
            </RoleGuard>
        </div>
    )
}
