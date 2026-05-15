import type { createApiClient } from "@/lib/apiClient"
import { ApiClientError } from "@/lib/apiClient"

type ApiClient = ReturnType<typeof createApiClient>

export interface CreateExpenseRequestDto {
    amount: number
    category: string
    description: string
    expenseDate: string
}

export type ExpenseRequestStatus =
    | "WAITING_FOR_APPROVAL"
    | "ESCALATED"
    | "APPROVED"
    | "DECLINED"
    | "CANCELLED"

export interface AppliedPolicySummary {
    id: number
    policyId: string
    name: string
    description: string | null
}

export type ManagerDecision = "APPROVE" | "DECLINE"

export interface ConflictingPolicy {
    id: number
    policyId: string
    name: string
    description: string
}

export interface ExpenseRequest {
    id: number
    userId: string
    amount: number
    category: string
    description: string
    expenseDate: string
    submittedAt: string
    status: ExpenseRequestStatus
    appliedPolicy?: AppliedPolicySummary | null
    decisionRationale?: string | null
    decidedBy?: string | null
    decidedAt?: string | null
}

export interface ExpenseRequestDetails extends ExpenseRequest {
    resolutionPolicyId: number | null
    conflictingPolicies: ConflictingPolicy[]
}

export interface ManagerDecisionDto {
    policyId: number
    decision: ManagerDecision
}

export interface ManagerDecisionResult {
    requestId: number
    status: ExpenseRequestStatus
    selectedPolicyId: number | null
    selectedPolicyRef: string | null
}

const API_BASE = "/api"

function getErrorMessageFromPayload(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") {
        return null
    }

    const parsed = payload as { message?: unknown; error?: unknown }

    if (typeof parsed.message === "string" && parsed.message.trim()) {
        return parsed.message
    }

    if (typeof parsed.error === "string" && parsed.error.trim()) {
        return parsed.error
    }

    return null
}

export function getExpenseRequestErrorMessage(
    error: unknown,
    fallback: string,
    statusMessages: Partial<Record<number, string>> = {}
) {
    if (error instanceof ApiClientError) {
        const payloadMessage = getErrorMessageFromPayload(error.data)

        if (payloadMessage) {
            return payloadMessage
        }

        const messageFromStatus =
            statusMessages[error.status] ??
            (error.status === 400
                ? "Niepoprawne dane żądania."
                : error.status === 403
                    ? "Brak uprawnień do wykonania tej operacji."
                    : error.status === 404
                        ? "Nie znaleziono wskazanego zasobu."
                        : undefined)

        return messageFromStatus ?? fallback
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message
    }

    return fallback
}

export function fetchExpenseRequests(client: ApiClient, userId: string) {
    return client.get<ExpenseRequest[]>(`${API_BASE}/users/${userId}/expense-requests`)
}

export function fetchExpenseRequestDetails(
    client: ApiClient,
    userId: string,
    expenseRequestId: string | number
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

export function submitManagerDecision(
    client: ApiClient,
    userId: string,
    expenseRequestId: string | number,
    data: ManagerDecisionDto
) {
    return client.post<ManagerDecisionResult>(
        `${API_BASE}/users/${userId}/expense-requests/${expenseRequestId}/manager-decision`,
        data,
        {
            headers: {
                "X-User-Role": "Manager",
            },
        }
    )
}
