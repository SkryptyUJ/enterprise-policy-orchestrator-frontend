"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPolicies, fetchPoliciesByUser, createPolicy } from "../api"
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"

export const policyKeys = {
    all: ["policies"] as const,
    byUser: (userId: string) => ["policies", "user", userId] as const,
    detail: (id: string) => ["policies", id] as const,
}

export function usePolicies() {
    const client = useApiClient()

    return useQuery({
        queryKey: policyKeys.all,
        queryFn: () => fetchPolicies(client),
    })
}

export function usePoliciesByUser() {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: policyKeys.byUser(user?.id ?? ""),
        queryFn: () => fetchPoliciesByUser(client, user!.id),
        enabled: !!user,
    })
}

export function useCreatePolicy() {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: import("../api").CreatePolicyDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            
            // Ekstrakcja liczbowego ID z usera i zredukowanie długości do 8 cyfr 
            // by zmieścić się w limicie Javy dla typu Long (max ~9.22 * 10^18)
            let userId = 1
            if (user.id) {
                const match = user.id.match(/\d+$/)
                if (match) {
                    const digits = match[0].slice(-8)
                    userId = parseInt(digits, 10)
                }
            }
            
            return createPolicy(client, data, userId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.all })
            if (user) {
                queryClient.invalidateQueries({ queryKey: policyKeys.byUser(user.id) })
            }
        },
    })
}
