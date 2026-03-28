import type { createApiClient } from "@/lib/apiClient"

type ApiClient = ReturnType<typeof createApiClient>

export interface CreateExpenseRequestDto {
    amount: number
    category: string
    description: string
    expenseDate: string
}

export interface ExpenseRequest {
    id: string
    amount: number
    category: string
    description: string
    expenseDate: string
    createdAt: string
}

const API_BASE = "http://localhost:8080/api"

export function createExpenseRequest(
    client: ApiClient,
    userId: string,
    data: CreateExpenseRequestDto
) {
    return client.post<ExpenseRequest>(
        `${API_BASE}/users/${userId}/expense-requests`,
        data
    )
}
