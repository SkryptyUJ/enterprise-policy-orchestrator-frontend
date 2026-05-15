"use client";

import { ReactNode } from "react";
import { canAccess, type Role } from "../access-control";
import { useAuth } from "../hooks/useAuth";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles?: Role[];
    fallback?: ReactNode;
}

export function RoleGuard({
    children,
    allowedRoles,
    fallback = null,
}: RoleGuardProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <>{fallback}</>;
    }

    if (!canAccess(user, allowedRoles)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
