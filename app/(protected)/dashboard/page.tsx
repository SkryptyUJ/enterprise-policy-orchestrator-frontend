import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Dashboard — Policy Orchestrator",
}

export default function DashboardPage() {
    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <Button asChild>
                    <Link href="/policy/new">Nowa polityka</Link>
                </Button>
            </div>
        </div>
    )
}
