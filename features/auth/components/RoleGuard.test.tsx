import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { RoleGuard } from "./RoleGuard"

const mockUseAuth = vi.fn()

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => mockUseAuth(),
}))

describe("RoleGuard", () => {
    it("renderuje children dla dozwolonej roli", () => {
        mockUseAuth.mockReturnValue({
            user: { id: "1", email: "test@example.com", name: "Test", roles: ["admin"] },
            isLoading: false,
        })

        render(
            <RoleGuard allowedRoles={["admin"]}>
                <div>sekretna sekcja</div>
            </RoleGuard>
        )

        expect(screen.getByText("sekretna sekcja")).toBeInTheDocument()
    })

    it("renderuje fallback dla niedozwolonej roli", () => {
        mockUseAuth.mockReturnValue({
            user: { id: "1", email: "test@example.com", name: "Test", roles: ["employee"] },
            isLoading: false,
        })

        render(
            <RoleGuard allowedRoles={["admin"]} fallback={<div>brak dostępu</div>}>
                <div>sekretna sekcja</div>
            </RoleGuard>
        )

        expect(screen.getByText("brak dostępu")).toBeInTheDocument()
        expect(screen.queryByText("sekretna sekcja")).not.toBeInTheDocument()
    })

    it("renderuje fallback dla niezalogowanego użytkownika", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoading: false,
        })

        render(
            <RoleGuard allowedRoles={["admin"]} fallback={<div>brak dostępu</div>}>
                <div>sekretna sekcja</div>
            </RoleGuard>
        )

        expect(screen.getByText("brak dostępu")).toBeInTheDocument()
    })

    it("nie renderuje nic podczas ładowania", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoading: true,
        })

        const { container } = render(
            <RoleGuard allowedRoles={["admin"]}>
                <div>sekretna sekcja</div>
            </RoleGuard>
        )

        expect(container).toBeEmptyDOMElement()
    })
})
