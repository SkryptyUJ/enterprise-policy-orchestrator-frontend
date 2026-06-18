import { beforeEach, describe, expect, it, vi } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { type ReactNode } from "react"
import { EditPolicyView } from "./EditPolicyView"

const mockPush = vi.fn()
const mockBack = vi.fn()
const mockUpdatePolicy = vi.fn()

const mockPolicy = {
    policyId: 42,
    name: "Polityka delegacji",
    description: "Opis polityki",
    categoryId: 1,
    categoryLabel: "Sprzęt biurowy",
    authorizedRole: 2,
    minPrice: 100,
    maxPrice: 1000,
    startsAt: "2026-05-01T10:00:00Z",
    expiresAt: "2026-12-31T10:00:00Z",
}

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, back: mockBack }),
}))

vi.mock("../hooks/usePolicies", () => ({
    usePolicyDetail: () => ({
        data: mockPolicy,
        isLoading: false,
        isError: false,
    }),
    useUpdatePolicy: () => ({
        mutate: mockUpdatePolicy,
        isPending: false,
        isError: false,
        error: null,
    }),
    usePolicyCategories: () => ({
        data: [{ id: 1, label: "Sprzęt biurowy" }],
        isLoading: false,
    }),
}))

function createWrapper() {
    const queryClient = new QueryClient()

    function TestQueryClientProvider({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }

    return TestQueryClientProvider
}

describe("EditPolicyView", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("po udanej edycji przekierowuje na stronę szczegółów polityki", async () => {
        const user = userEvent.setup()

        mockUpdatePolicy.mockImplementation((_payload, options) => {
            options?.onSuccess?.()
        })

        render(<EditPolicyView policyId="42" />, { wrapper: createWrapper() })

        await waitFor(() => {
            expect(screen.getByDisplayValue("Polityka delegacji")).toBeInTheDocument()
        })

        await user.click(screen.getByRole("combobox"))
        await user.click(await screen.findByRole("option", { name: "Sprzęt biurowy" }))

        await user.click(screen.getByRole("button", { name: /zapisz zmiany/i }))

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/policy/42")
        })
    })
})
