"use client"

import { useQuery } from "@tanstack/react-query"
import {
    fetchExpenseRequests,
    fetchExpenseRequestDetails,
} from "../api"
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"

export const expenseRequestKeys = {
    all: ["expense-requests"] as const,
    list: () => [...expenseRequestKeys.all, "list"] as const,
    details: (expenseRequestId: string) => [...expenseRequestKeys.all, "details", expenseRequestId] as const,
}

export function useExpenseRequests() {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: expenseRequestKeys.list(),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            return fetchExpenseRequests(client)
        },
        enabled: Boolean(user),
    })
}

export function useExpenseRequestDetails(expenseRequestId: string | null) {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: expenseRequestKeys.details(expenseRequestId ?? "missing"),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            if (!expenseRequestId) throw new Error("Brak identyfikatora wniosku")
            return fetchExpenseRequestDetails(client, user.id, expenseRequestId)
        },
        enabled: Boolean(user && expenseRequestId),
    })
}

