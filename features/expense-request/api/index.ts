import type { createApiClient } from "@/lib/apiClient"

type ApiClient = ReturnType<typeof createApiClient>

export interface CreateExpenseRequestDto {
    amount: number
    categoryId: number
    description: string
    expenseDate: string
}

export interface ExpenseRequest {
    id: string
    userId: string
    amount: number
    categoryId: number
    categoryLabel: string
    description: string
    expenseDate: string
    submittedAt: string
    status?: string
    applicablePolicies: string[]
    decisionRationale?: string | null
    decidedBy?: string | null
    decidedAt?: string | null
}

export type ExpenseRequestDetails = ExpenseRequest

export interface ApproveExpenseRequestDto {
    decisionRationale: string
}

const API_BASE = "/api"

export function fetchExpenseRequests(client: ApiClient) {
    return client.get<ExpenseRequest[]>(`${API_BASE}/expense-requests`)
}

export function fetchExpenseRequestsForReview(client: ApiClient) {
    return client.get<ExpenseRequest[]>(`${API_BASE}/expense-requests/review`)
}

export function fetchExpenseRequestDetails(
    client: ApiClient,
    expenseRequestId: string
) {
    return client.get<ExpenseRequestDetails>(`${API_BASE}/expense-requests/${expenseRequestId}`)
}

export function fetchExpenseRequestDetailsForReview(
    client: ApiClient,
    expenseRequestId: string
) {
    return client.get<ExpenseRequestDetails>(`${API_BASE}/expense-requests/review/${expenseRequestId}`)
}

export function approveExpenseRequest(
    client: ApiClient,
    expenseRequestId: string,
    data: ApproveExpenseRequestDto
) {
    return client.patch<ExpenseRequestDetails>(
        `${API_BASE}/expense-requests/review/${expenseRequestId}/approve`,
        data
    )
}

export function declineExpenseRequest(
    client: ApiClient,
    expenseRequestId: string,
    data: ApproveExpenseRequestDto
) {
    return client.patch<ExpenseRequestDetails>(
        `${API_BASE}/expense-requests/review/${expenseRequestId}/decline`,
        data
    )
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
