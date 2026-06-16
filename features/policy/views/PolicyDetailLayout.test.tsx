import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PolicyDetailLayout } from "./PolicyDetailLayout"

vi.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams("history=true"),
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

vi.mock("@/features/auth/components/RoleGuard", () => ({
    RoleGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("../components/SetExpirationDialog", () => ({
    SetExpirationDialog: () => <button type="button">Ustaw wygaśnięcie</button>,
}))

vi.mock("./PolicyHistoryView", () => ({
    PolicyHistoryView: () => <div>Widok historii polityki</div>,
}))

vi.mock("../hooks/usePolicyVersions", () => ({
    usePolicyVersions: () => ({
        allVersions: [],
        versions: [],
        dateRange: { start: "", end: "" },
        setDateRange: vi.fn(),
        isLoading: false,
    }),
}))

vi.mock("../hooks/usePolicies", () => ({
    usePolicyCategories: () => ({ data: [] }),
    usePolicyDetail: () => ({
        data: {
            id: 42,
            policyId: 42,
            name: "Polityka delegacji",
            description: "Opis",
            version: 1,
            startsAt: null,
            expiresAt: null,
            minPrice: 100,
            maxPrice: 1000,
            category: 1,
            authorizedRole: 2,
            active: true,
            isValid: true,
        },
        isLoading: false,
        isError: false,
    }),
}))

describe("PolicyDetailLayout", () => {
    it("otwiera historię, gdy query param history=true jest obecny", () => {
        render(<PolicyDetailLayout policyId="42" />)

        expect(screen.getByText("Historia modyfikacji")).toBeInTheDocument()
        expect(screen.getByText("Widok historii polityki")).toBeInTheDocument()
    })
})
