"use client";

import { ReactNode } from "react";
import { useAuth, Role } from "../hooks/useAuth";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: Role[];
    fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null; // or a spinner
    }

    if (!user) {
        return <>{fallback}</>;
    }

    // Check if the user has AT LEAST ONE of the allowed roles
    const hasAccess = allowedRoles.some((role) => user.roles.includes(role));

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
