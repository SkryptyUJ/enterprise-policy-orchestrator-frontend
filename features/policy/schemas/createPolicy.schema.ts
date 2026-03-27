import { z } from "zod"

export const createPolicySchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa jest wymagana")
    .max(100, "Nazwa może mieć maksymalnie 100 znaków"),
  description: z
    .string()
    .max(500, "Opis może mieć maksymalnie 500 znaków")
    .optional(),
})

export type CreatePolicyFormValues = z.infer<typeof createPolicySchema>
