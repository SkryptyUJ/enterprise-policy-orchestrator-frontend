import type { createApiClient } from "@/lib/apiClient"
import type { Policy } from "@/features/policy/api"

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
    status?: string
    appliedPolicy?: Policy | null
    decisionRationale?: string | null
    decidedBy?: string | null
    decidedAt?: string | null
}

export interface ExpenseRequestDetails extends ExpenseRequest {
    approvedAt?: string | null
    rejectedAt?: string | null
    rejectionReason?: string | null
    updatedAt?: string
}

const API_BASE = "http://localhost:8080/api"

export function fetchExpenseRequests(client: ApiClient, userId: string) {
    return client.get<ExpenseRequest[]>(`${API_BASE}/users/${userId}/expense-requests`)
}

export function fetchExpenseRequestDetails(
    client: ApiClient,
    userId: string,
    expenseRequestId: string
) {
    return client.get<ExpenseRequestDetails>(`${API_BASE}/users/${userId}/expense-requests/${expenseRequestId}`)
}

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
