"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import {
    AUTH0_NAMESPACE,
    type Role,
    normalizeRoles,
} from "../access-control";

export interface AuthUser {
    id: string
    email: string
    name: string
    roles: Role[]
}

export function useAuth(): { user: AuthUser | null; isLoading: boolean; error?: Error | null } {
    const { user, isLoading, error } = useUser()

    if (!user) {
        return { user: null, isLoading, error }
    }

    const rawRoles = user[`${AUTH0_NAMESPACE}/roles`];
    const roles = normalizeRoles(rawRoles);


    return {
        user: {
            id: user.sub ?? "",
            email: user.email ?? "",
            name: user.name ?? "",
            roles,
        },
        isLoading,
        error
    }
}
