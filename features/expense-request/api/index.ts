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
    userId: string
    amount: number
    category: string
    description: string
    expenseDate: string
    submittedAt: string
    status?: string
    appliedPolicy?: Policy | null
    decisionRationale?: string | null
    decidedBy?: string | null
    decidedAt?: string | null
}

export type ExpenseRequestDetails = ExpenseRequest

export interface ApproveExpenseRequestDto {
    decisionRationale: string
}

const API_BASE = "/api"

export function fetchExpenseRequests(client: ApiClient, userId: string) {
    return client.get<ExpenseRequest[]>(`${API_BASE}/users/${userId}/expense-requests`)
}

export function fetchExpenseRequestsForReview(client: ApiClient, userId: string) {
    return client.get<ExpenseRequest[]>(`${API_BASE}/users/${userId}/expense-requests/review`)
}

export function fetchExpenseRequestDetails(
    client: ApiClient,
    userId: string,
    expenseRequestId: string
) {
    return client.get<ExpenseRequestDetails>(`${API_BASE}/users/${userId}/expense-requests/${expenseRequestId}`)
}

export function fetchExpenseRequestDetailsForReview(
    client: ApiClient,
    userId: string,
    expenseRequestId: string
) {
    return client.get<ExpenseRequestDetails>(`${API_BASE}/users/${userId}/expense-requests/review/${expenseRequestId}`)
}

export function approveExpenseRequest(
    client: ApiClient,
    userId: string,
    expenseRequestId: string,
    data: ApproveExpenseRequestDto
) {
    return client.patch<ExpenseRequestDetails>(
        `${API_BASE}/users/${userId}/expense-requests/review/${expenseRequestId}/approve`,
        data
    )
}

export function declineExpenseRequest(
    client: ApiClient,
    userId: string,
    expenseRequestId: string,
    data: ApproveExpenseRequestDto
) {
    return client.patch<ExpenseRequestDetails>(
        `${API_BASE}/users/${userId}/expense-requests/review/${expenseRequestId}/decline`,
        data
    )
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
