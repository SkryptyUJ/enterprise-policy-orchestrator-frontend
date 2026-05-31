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

const API_BASE = "/api"

export function fetchExpenseRequests(client: ApiClient) {
    return client.get<ExpenseRequest[]>(`${API_BASE}/expense-requests`)
}

export function fetchExpenseRequestDetails(
    client: ApiClient,
    expenseRequestId: string
) {
    return client.get<ExpenseRequestDetails>(`${API_BASE}/expense-requests/${expenseRequestId}`)
}

export function createExpenseRequest(
    client: ApiClient,
    data: CreateExpenseRequestDto
) {
    return client.post<ExpenseRequest>(
        `${API_BASE}/expense-requests`,
        data
    )
}
