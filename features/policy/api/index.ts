import type { createApiClient } from "@/lib/apiClient"
import type { AuthUser } from "@/features/auth/hooks/useAuth"

type ApiClient = ReturnType<typeof createApiClient>

export interface Policy {
    id: string
    title: string
    status: "active" | "inactive" | "draft"
    createdAt: string
}

export interface CreatePolicyDto {
    title: string
    description: string
}

export function fetchPolicies(client: ApiClient) {
    return client.get<Policy[]>("/api/policies")
}

export function fetchPoliciesByUser(client: ApiClient, userId: string) {
    return client.get<Policy[]>(`/api/policies?userId=${userId}`)
}

export function createPolicy(client: ApiClient, data: CreatePolicyDto, user: AuthUser) {
    return client.post<Policy>("/api/policies", {
        ...data,
        createdBy: user.id,
        createdByRole: user.role,
    })
}
