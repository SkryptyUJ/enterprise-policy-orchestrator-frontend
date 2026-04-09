import type { createApiClient } from "@/lib/apiClient"

type ApiClient = ReturnType<typeof createApiClient>

export interface Policy {
    id: number
    policyId: number | null
    authorUserId: number | null
    categoryId: number | null
    name: string
    description: string | null
    version: number | null
    createdAt: string | null
    updatedAt: string | null
    startsAt: string | null
    expiresAt: string | null
    minPrice: number | null
    maxPrice: number | null
    category: number | null
    authorizedRole: number | null
    isValid: boolean | null
}

export interface CreatePolicyDto {
    categoryId?: number
    name: string
    description?: string
    startsAt?: string
    expiresAt?: string
    minPrice?: number
    maxPrice?: number
    category?: number
    authorizedRole?: number
}

export function fetchPolicies(client: ApiClient) {
    return client.get<Policy[]>("/api/policies")
}

export function fetchPoliciesByUser(client: ApiClient, userId: string) {
    return client.get<Policy[]>(`/api/policies?userId=${userId}`)
}

export function createPolicy(client: ApiClient, data: CreatePolicyDto, userId: number) {
    return client.post<Policy>(`/api/users/${userId}/policies`, data)
}

export function getPolicyById(client: ApiClient, userId: number, policyId: number) {
    return client.get<Policy>(`/api/users/${userId}/policies/${policyId}`)
}

export function updatePolicy(client: ApiClient, data: CreatePolicyDto, userId: number, policyId: number) {
    return client.put<Policy>(`/api/users/${userId}/policies/${policyId}`, data)
}
