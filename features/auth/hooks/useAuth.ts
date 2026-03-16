"use client"

import { useUser } from "@auth0/nextjs-auth0"

export interface AuthUser {
    id: string
    email: string
    name: string
    role: "admin" | "manager" | "viewer"  // claim z Auth0, np. z namespace "https://policy-orchestrator.com/role"
}

export function useAuth(): { user: AuthUser | null; isLoading: boolean } {
    // const { user, isLoading } = useUser()
    // return {
    //   user: user ? {
    //     id: user.sub!,
    //     email: user.email!,
    //     name: user.name!,
    //     role: user["https://policy-orchestrator.com/role"] as AuthUser["role"],
    //   } : null,
    //   isLoading,
    // }

    return { user: null, isLoading: false }
}
