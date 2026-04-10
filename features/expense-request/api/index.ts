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
    status?: string
}

export interface ExpenseRequestDetails extends ExpenseRequest {
    approvedAt?: string | null
    rejectedAt?: string | null
    rejectionReason?: string | null
    updatedAt?: string
}

const API_BASE = "http://localhost:8080/api"

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
    return client.post<ExpenseRequest>(`${API_BASE}/expense-requests`, data)
}
