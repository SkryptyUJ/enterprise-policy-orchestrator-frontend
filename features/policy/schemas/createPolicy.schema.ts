import { z } from "zod"

const optionalNumber = z.preprocess(
    (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const n = Number(val);
        return isNaN(n) ? undefined : n;
    },
    z.number().int().optional()
).optional()

const requiredNumber = z.preprocess(
    (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const n = Number(val);
        return isNaN(n) ? undefined : n;
    },
    z.number({ message: "Pole jest wymagane" }).int()
)

const optionalDate = z.preprocess(
    (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return val;
    },
    z.string().optional()
).optional()

const requiredDate = z.preprocess(
    (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return val;
    },
    z.string({ message: "Pole jest wymagane" }).min(1, "Pole jest wymagane")
)

export const createPolicySchema = z.object({
    name: z
        .string()
        .min(1, "Nazwa jest wymagana")
        .max(100, "Nazwa może mieć maksymalnie 100 znaków"),
    description: z
        .string()
        .max(500, "Opis może mieć maksymalnie 500 znaków")
        .optional(),
    categoryId: requiredNumber,
    startsAt: requiredDate,
    expiresAt: optionalDate,
    minPrice: optionalNumber,
    maxPrice: optionalNumber,
    category: requiredNumber,
    authorizedRole: optionalNumber,
})

export type CreatePolicyFormValues = z.infer<typeof createPolicySchema>
