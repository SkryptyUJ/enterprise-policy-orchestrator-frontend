import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPolicies, createPolicy } from "../api"
import { useAuth } from "@/features/auth/hooks/useAuth"

export const policyKeys = {
    all: ["policies"] as const,
    byUser: (userId: string) => ["policies", "user", userId] as const,
    detail: (id: string) => ["policies", id] as const,
}

export function usePolicies() {
    return useQuery({
        queryKey: policyKeys.all,
        queryFn: async () => {
            // const token = await getAccessTokenSilently()
            const token = "placeholder-token"
            return fetchPolicies(token)
        },
    })
}

export function usePoliciesByUser() {
    const { user } = useAuth()

    return useQuery({
        queryKey: policyKeys.byUser(user?.id ?? ""),
        queryFn: async () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            // const token = await getAccessTokenSilently()
            const token = "placeholder-token"
            return fetchPolicies(token)
        },
        enabled: !!user,
    })
}

export function useCreatePolicy() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (data: { title: string; description: string }) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            // const token = await getAccessTokenSilently()
            const token = "placeholder-token"
            return createPolicy(data, token, user)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.all })
            if (user) {
                queryClient.invalidateQueries({ queryKey: policyKeys.byUser(user.id) })
            }
        },
    })
}
