"use client";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "../hooks/useAuth";
import { type Role } from "../access-control";

const ROLE_LABELS: Record<Role, string> = {
    admin: "Admin",
    employee: "Pracownik",
    manager: "Manager",
    compliance_officer: "Compliance Officer",
};

export function UserRoleBadge() {
    const { user, isLoading } = useAuth();

    if (isLoading || !user || user.roles.length === 0) {
        return null;
    }

    const primaryRole = user.roles[0];

    return (
        <Badge variant="outline" className="h-7 rounded-full px-3 text-xs font-medium">
            Rola: {ROLE_LABELS[primaryRole] ?? primaryRole}
        </Badge>
    );
}
