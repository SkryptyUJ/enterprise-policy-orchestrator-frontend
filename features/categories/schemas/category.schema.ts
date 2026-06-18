import { z } from "zod"

export const createCategorySchema = z.object({
    label: z
        .string()
        .trim()
        .min(2, "Nazwa kategorii musi mieć co najmniej 2 znaki")
        .max(100, "Nazwa kategorii może mieć maksymalnie 100 znaków"),
})

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>
