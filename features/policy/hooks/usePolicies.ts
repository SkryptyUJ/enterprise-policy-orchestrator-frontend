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
        mutationFn: (data: { name: string; description?: string }) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            return createPolicy(client, data, user)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.all })
            if (user) {
                queryClient.invalidateQueries({ queryKey: policyKeys.byUser(user.id) })
            }
        },
    })
}
