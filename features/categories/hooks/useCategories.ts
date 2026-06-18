"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { createCategory, deleteCategory, fetchCategories, type CreateCategoryDto } from "../api"

export const categoryKeys = {
    all: ["categories"] as const,
}

export function useCategories() {
    const client = useApiClient()
    const { user } = useAuth()

    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return fetchCategories(client)
        },
        enabled: Boolean(user),
        staleTime: 5 * 60 * 1000,
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (data: CreateCategoryDto) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return createCategory(client, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all })
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()
    const client = useApiClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (categoryId: number) => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")

            return deleteCategory(client, categoryId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all })
            queryClient.invalidateQueries({ queryKey: ["policies"] })
        },
    })
}
