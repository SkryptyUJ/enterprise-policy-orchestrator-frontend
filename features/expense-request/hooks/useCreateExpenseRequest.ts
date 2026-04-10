"use client"

import { useMutation } from "@tanstack/react-query"
import { createExpenseRequest, type CreateExpenseRequestDto } from "../api"
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function useCreateExpenseRequest() {
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: CreateExpenseRequestDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            return createExpenseRequest(client, data)
        },
    })
}
