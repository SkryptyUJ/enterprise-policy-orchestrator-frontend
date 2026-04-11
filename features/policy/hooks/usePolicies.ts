"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPolicies, fetchPoliciesByUser, createPolicy, getPolicyById, updatePolicy, getAllPolicies, setPolicyExpiration, CreatePolicyDto, SetPolicyExpirationDto } from "../api"
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

            // TEMP
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

export function usePolicyDetail(policyId: number) {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: policyKeys.detail(String(policyId)),
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            // TEMP FIX TS ERROR, USER ID ON BACKEND IS TYPE OF LONG
            let userId = 1
            if (user.id) {
                const match = user.id.match(/\d+$/)
                if (match) {
                    const digits = match[0].slice(-8)
                    userId = parseInt(digits, 10)
                }
            }

            return getPolicyById(client, userId, policyId)
        },
        enabled: !!user && !!policyId,
    })
}

export function useUpdatePolicy(policyId: number) {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: CreatePolicyDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            let userId = 1
            if (user.id) {
                const match = user.id.match(/\d+$/)
                if (match) {
                    const digits = match[0].slice(-8)
                    userId = parseInt(digits, 10)
                }
            }

            return updatePolicy(client, data, userId, policyId)
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

export function useAllPolicies() {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: policyKeys.all,
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return getAllPolicies(client, user.id)
        },
        enabled: !!user,
    })
}

export function useSetPolicyExpiration(policyId: number) {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: SetPolicyExpirationDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return setPolicyExpiration(client, user.id, policyId, data)
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
