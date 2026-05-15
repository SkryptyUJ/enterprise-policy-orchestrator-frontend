"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createExpenseRequest, type CreateExpenseRequestDto } from "../api"
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { expenseRequestKeys } from "./useExpenseRequests"

export function useCreateExpenseRequest() {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: CreateExpenseRequestDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            return createExpenseRequest(client, user.id, data)
        },
        onSuccess: () => {
            if (!user) return

            queryClient.invalidateQueries({ queryKey: expenseRequestKeys.list(user.id) })
        },
    })
}
