import type { createApiClient } from "@/lib/apiClient"

type ApiClient = ReturnType<typeof createApiClient>

export interface Policy {
    id: number
    policyId: string
    authorUserId: string
    categoryId: number
    name: string
    description: string | null
    version: number
    createdAt: string
    updatedAt: string
    startsAt: string
    expiresAt: string | null
    minPrice: number | null
    maxPrice: number | null
    category: string
    authorizedRole: number | null
}

export interface CreatePolicyDto {
    policyId?: string
    categoryId: number
    name: string
    description?: string
    startsAt: string
    expiresAt?: string
    minPrice?: number
    maxPrice?: number
    category: string
    authorizedRole?: number
}

export interface SetPolicyExpirationDto {
    expiresAt: string
}

export interface CategoryOption {
    id: number
    value: string
    label: string
}

export function fetchPolicies(client: ApiClient) {
    return client.get<Policy[]>("/api/policies")
}

export function fetchCategoryOptions(client: ApiClient) {
    return client.get<CategoryOption[]>("/api/categories")
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
