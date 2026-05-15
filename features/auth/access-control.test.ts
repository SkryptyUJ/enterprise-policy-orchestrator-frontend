import { describe, expect, it } from "vitest"
import { canAccess, hasAnyRole, normalizeRoles, type Role } from "./access-control"

describe("access-control", () => {
    it("normalizuje tylko wspierane role", () => {
        expect(normalizeRoles(["admin", "manager", "unknown", 123])).toEqual([
            "admin",
            "manager",
        ])
    })

    it("sprawdza dostęp, gdy użytkownik ma jedną z dozwolonych ról", () => {
        const user = {
            roles: ["manager"] as Role[],
        }

        expect(hasAnyRole(user, ["employee", "manager"])).toBe(true)
        expect(canAccess(user, ["employee", "manager"])).toBe(true)
    })

    it("odmawia dostępu, gdy użytkownik nie ma wymaganej roli", () => {
        const user = {
            roles: ["employee"] as Role[],
        }

        expect(hasAnyRole(user, ["admin"])).toBe(false)
        expect(canAccess(user, ["admin"])).toBe(false)
    })

    it("zwraca true, gdy widok nie ma ograniczeń ról", () => {
        const user = {
            roles: ["employee"] as Role[],
        }

        expect(canAccess(user)).toBe(true)
        expect(canAccess(user, [])).toBe(true)
    })

    it("odmawia dostępu niezalogowanemu użytkownikowi dla chronionych ról", () => {
        expect(canAccess(null, ["admin"])).toBe(false)
    })
})
