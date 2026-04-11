"use client"

import { useUser } from "@auth0/nextjs-auth0/client"

export type Role = "admin" | "employee" | "manager" | "compliance_officer";

export interface AuthUser {
    id: string
    email: string
    name: string
    roles: Role[]  // A user can have multiple roles
}

export function useAuth(): { user: AuthUser | null; isLoading: boolean; error?: Error | null } {
    const { user, isLoading, error } = useUser()

    if (!user) {
        return { user: null, isLoading, error }
    }

    // Role pochodzą z custom claim "https://policy-orchestrator.com/roles"
    // Na ten moment ZAMOCKOWANE - użytkownik z Auth0 dostaje lokalnie wszystkie możliwe role!
    // Docelowo: const rawRoles = user["https://policy-orchestrator.com/roles"] as string[] | undefined;
    const rawRoles = ["admin", "employee", "manager", "compliance_officer"];
    const roles = Array.isArray(rawRoles) ? (rawRoles as Role[]) : [];

    return {
        user: {
            id: user.sub?.replace("google-oauth2|", "") ?? "",
            email: user.email ?? "",
            name: user.name ?? "",
            roles,
        },
        isLoading,
        error
    }
}
