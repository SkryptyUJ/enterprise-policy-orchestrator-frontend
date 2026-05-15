"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    fetchExpenseRequests,
    fetchExpenseRequestDetails,
    submitManagerDecision,
    type ManagerDecision,
} from "../api"
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"

export const expenseRequestKeys = {
    all: ["expense-requests"] as const,
    list: (userId: string) => [...expenseRequestKeys.all, "list", userId] as const,
    details: (expenseRequestId: string) => [...expenseRequestKeys.all, "details", expenseRequestId] as const,
}

export function useExpenseRequests() {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: expenseRequestKeys.list(user?.id ?? "anonymous"),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            return fetchExpenseRequests(client, user.id)
        },
        enabled: Boolean(user),
    })
}

export function useExpenseRequestDetails(expenseRequestId: string | number | null) {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: expenseRequestKeys.details(String(expenseRequestId ?? "missing")),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            if (!expenseRequestId) throw new Error("Brak identyfikatora wniosku")
            return fetchExpenseRequestDetails(client, user.id, expenseRequestId)
        },
        enabled: Boolean(user && expenseRequestId),
    })
}

interface ManagerDecisionPayload {
    policyId: number
    decision: ManagerDecision
}

export function useManagerDecision(expenseRequestId: string | number | null) {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: ManagerDecisionPayload) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            if (!expenseRequestId) throw new Error("Brak identyfikatora wniosku")

            return submitManagerDecision(client, user.id, expenseRequestId, data)
        },
        onSuccess: () => {
            if (!user) return

            queryClient.invalidateQueries({ queryKey: expenseRequestKeys.list(user.id) })
            queryClient.invalidateQueries({
                queryKey: expenseRequestKeys.details(String(expenseRequestId)),
            })
        },
    })
}

