import type { createApiClient } from "@/lib/apiClient"

type ApiClient = ReturnType<typeof createApiClient>

export interface Category {
    id: number
    label: string
}

export interface CreateCategoryDto {
    label: string
}

export function fetchCategories(client: ApiClient) {
    return client.get<Category[]>("/api/categories")
}

export function createCategory(client: ApiClient, data: CreateCategoryDto) {
    return client.post<Category>("/api/categories", data)
}

export function deleteCategory(client: ApiClient, categoryId: number) {
    return client.delete<void>(`/api/categories/${categoryId}`)
}
