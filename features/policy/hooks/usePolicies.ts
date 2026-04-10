"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPolicies, fetchPoliciesByUser, createPolicy, getPolicyById, updatePolicy, CreatePolicyDto } from "../api"
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
        mutationFn: (data: CreatePolicyDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return createPolicy(client, data, user.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.all })
            if (user) {
                queryClient.invalidateQueries({ queryKey: policyKeys.byUser(user.id) })
            }
        },
    })
}

export function usePolicyDetail(policyId: string) {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: policyKeys.detail(String(policyId)),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return getPolicyById(client, user.id, policyId)
        },
        enabled: !!user && !!policyId,
    })
}

export function useUpdatePolicy(policyId: string) {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: CreatePolicyDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return updatePolicy(client, data, user.id, policyId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.all })
            queryClient.invalidateQueries({ queryKey: policyKeys.detail(String(policyId)) })
            if (user) {
                queryClient.invalidateQueries({ queryKey: policyKeys.byUser(user.id) })
            }
        },
    })
}
