"use client"

import { ExpenseRequestForm } from "../components/ExpenseRequestForm"

export function CreateExpenseRequestView() {
    return (
        <div className="flex min-h-[calc(100dvh-4rem)] items-start justify-center px-4 py-10">
            <ExpenseRequestForm />
        </div>
    )
}
