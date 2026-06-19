"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    fetchExpenseRequests,
    fetchExpenseRequestDetails,
    fetchExpenseRequestsForReview,
    fetchExpenseRequestDetailsForReview,
    approveExpenseRequest,
    declineExpenseRequest,
} from "../api"
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"

type ExpenseRequestListMode = "self" | "review"

const REVIEW_ROLES = new Set(["manager", "admin"])

function resolveListMode(user: ReturnType<typeof useAuth>["user"]): ExpenseRequestListMode {
    if (!user) return "self"
    return user.roles.some((role) => REVIEW_ROLES.has(role)) ? "review" : "self"
}

export const expenseRequestKeys = {
    all: ["expense-requests"] as const,
    list: (mode: ExpenseRequestListMode, userId: string) => [...expenseRequestKeys.all, "list", mode, userId] as const,
    details: (mode: ExpenseRequestListMode, expenseRequestId: string, userId: string) =>
        [...expenseRequestKeys.all, "details", mode, expenseRequestId, userId] as const,
}

export function useExpenseRequests() {
    const client = useApiClient()
    const { user } = useAuth()
    const mode = resolveListMode(user)

    return useQuery({
        queryKey: expenseRequestKeys.list(mode, user?.id ?? "anonymous"),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            if (mode === "review") {
                return fetchExpenseRequestsForReview(client)
            }

            return fetchExpenseRequests(client)
        },
        enabled: Boolean(user),
    })
}

export function useExpenseRequestDetails(expenseRequestId: string | null) {
    const client = useApiClient()
    const { user } = useAuth()
    const mode = resolveListMode(user)

    return useQuery({
        queryKey: expenseRequestKeys.details(mode, expenseRequestId ?? "missing", user?.id ?? "anonymous"),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            if (!expenseRequestId) throw new Error("Brak identyfikatora wniosku")

            if (mode === "review") {
                return fetchExpenseRequestDetailsForReview(client, expenseRequestId)
            }

            return fetchExpenseRequestDetails(client, expenseRequestId)
        },
        enabled: Boolean(user && expenseRequestId),
    })
}

export function useApproveExpenseRequest() {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: ({
            expenseRequestId,
            decisionRationale,
            appliedPolicy,
        }: {
            expenseRequestId: string
            decisionRationale: string
            appliedPolicy: string | null
        }) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            const mode = resolveListMode(user)
            if (mode !== "review") {
                throw new Error("Brak uprawnień do zatwierdzania wniosków")
            }

            return approveExpenseRequest(client, expenseRequestId, { decisionRationale, appliedPolicy })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expenseRequestKeys.all })
        },
    })
}

export function useDeclineExpenseRequest() {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: ({ expenseRequestId, decisionRationale }: { expenseRequestId: string; decisionRationale: string }) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            const mode = resolveListMode(user)
            if (mode !== "review") {
                throw new Error("Brak uprawnień do odrzucania wniosków")
            }

            return declineExpenseRequest(client, expenseRequestId, { decisionRationale })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expenseRequestKeys.all })
        },
    })
}

