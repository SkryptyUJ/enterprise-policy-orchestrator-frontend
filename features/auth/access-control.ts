export const AUTH0_NAMESPACE = process.env.NEXT_PUBLIC_AUTH0_NAMESPACE || "";

export const ROLES = [
    "admin",
    "employee",
    "manager",
    "compliance_officer",
] as const;

export type Role = (typeof ROLES)[number];

type AccessUser = {
    roles: Role[];
};

function isRole(value: string): value is Role {
    return ROLES.includes(value as Role);
}

export function normalizeRoles(rawRoles: unknown): Role[] {
    if (!Array.isArray(rawRoles)) {
        return [];
    }

    return rawRoles.filter((role): role is Role => typeof role === "string" && isRole(role));
}

export function hasAnyRole(user: AccessUser | null, allowedRoles: Role[]): boolean {
    if (!user) {
        return false;
    }

    return allowedRoles.some((role) => user.roles.includes(role));
}

export function canAccess(user: AccessUser | null, allowedRoles?: Role[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) {
        return true;
    }

    return hasAnyRole(user, allowedRoles);
}
