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
    policyId?: string
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

export interface SetPolicyExpirationDto {
    expiresAt: string
}

export function fetchPolicies(client: ApiClient) {
    return client.get<Policy[]>("/api/policies")
}

export function fetchPoliciesByUser(client: ApiClient, userId: string) {
    return client.get<Policy[]>(`/api/policies?userId=${userId}`)
}

export function createPolicy(client: ApiClient, data: CreatePolicyDto, userId: string) {
    return client.post<Policy>(`/api/users/${userId}/policies`, data)
}

export function getPolicyById(client: ApiClient, userId: string, policyId: string) {
    return client.get<Policy>(`/api/users/${userId}/policies/${policyId}`)
}

export function updatePolicy(client: ApiClient, data: CreatePolicyDto, userId: string, policyId: string) {
    return client.post<Policy>(`/api/users/${userId}/policies`, { ...data, policyId: data.policyId || String(policyId) })
}

export function getPolicyHistory(client: ApiClient, userId: string, policyId: string) {
    return client.get<Policy[]>(`/api/users/${userId}/policies/${policyId}/history`)
}

export function getAllPolicies(client: ApiClient, userId: string) {
    return client.get<Policy[]>(`/api/users/${userId}/policies`)
}

export function setPolicyExpiration(client: ApiClient, userId: string, policyId: number, data: SetPolicyExpirationDto) {
    return client.patch<Policy>(`/api/users/${userId}/policies/${policyId}/expiration`, data)
}
