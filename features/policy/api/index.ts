import type { AuthUser } from "@/features/auth/hooks/useAuth"

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

export async function fetchPolicies(token: string): Promise<Policy[]> {
    const res = await fetch("/api/policies", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error("Nie udało się pobrać polityk")
    return res.json()
}

export async function createPolicy(
    data: CreatePolicyDto,
    token: string,
    user: AuthUser
): Promise<Policy> {
    const res = await fetch("/api/policies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            ...data,
            createdBy: user.id,
            createdByRole: user.role,
        }),
    })
    if (!res.ok) throw new Error("Nie udało się utworzyć polityki")
    return res.json()
}

export async function fetchPoliciesByUser(
    userId: string,
    token: string
): Promise<Policy[]> {
    const res = await fetch(`/api/policies?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error("Nie udało się pobrać polityk użytkownika")
    return res.json()
}
