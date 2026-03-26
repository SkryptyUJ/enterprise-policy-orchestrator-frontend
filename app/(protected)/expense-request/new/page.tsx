import { CreateExpenseRequestView } from "@/features/expense-request/views/CreateExpenseRequestView"

export const metadata = {
    title: "Nowy wniosek wydatkowy — Policy Orchestrator",
}

export default function ExpenseRequestNewPage() {
    return <CreateExpenseRequestView />
}
