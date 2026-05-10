"use client"

export type Role = "admin" | "employee" | "manager" | "compliance_officer";

export interface AuthUser {
    id: string
    email: string
    name: string
    roles: Role[]
}

const MOCK_USER: AuthUser = {
    id: "mock-user-1",
    email: "dev@example.com",
    name: "Dev User",
    roles: ["admin", "employee", "manager", "compliance_officer"],
}

export function useAuth(): { user: AuthUser | null; isLoading: boolean; error?: Error | null } {
    return {
        user: MOCK_USER,
        isLoading: false,
        error: null
    }
}
