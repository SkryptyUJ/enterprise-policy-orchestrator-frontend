import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { SetExpirationDialog } from "./SetExpirationDialog"

const mockMutate = vi.fn()

vi.mock("../hooks/usePolicies", () => ({
    useSetPolicyExpiration: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

function createWrapper() {
    const queryClient = new QueryClient()
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe("SetExpirationDialog", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renderuje przycisk otwierający dialog", () => {
        render(
            <SetExpirationDialog policyId={1} policyName="Polityka podróży" currentExpiresAt={null} />,
            { wrapper: createWrapper() }
        )

        expect(screen.getByText("Ustaw datę zakończenia")).toBeInTheDocument()
    })

    it("pokazuje tekst 'Zmień datę zakończenia' gdy polityka już ma expiresAt", () => {
        render(
            <SetExpirationDialog policyId={1} policyName="Polityka podróży" currentExpiresAt="2026-12-31T23:59:00Z" />,
            { wrapper: createWrapper() }
        )

        expect(screen.getByText("Zmień datę zakończenia")).toBeInTheDocument()
    })

    it("otwiera dialog po kliknięciu przycisku", async () => {
        const user = userEvent.setup()

        render(
            <SetExpirationDialog policyId={1} policyName="Polityka podróży" currentExpiresAt={null} />,
            { wrapper: createWrapper() }
        )

        await user.click(screen.getByText("Ustaw datę zakończenia"))

        expect(screen.getByText("Ustaw datę zakończenia obowiązywania")).toBeInTheDocument()
        expect(screen.getByText(/Polityka podróży/)).toBeInTheDocument()
        expect(screen.getByLabelText("Data i czas zakończenia")).toBeInTheDocument()
    })

    it("ma przycisk Zapisz zablokowany gdy nie wybrano daty", async () => {
        const user = userEvent.setup()

        render(
            <SetExpirationDialog policyId={1} policyName="Polityka podróży" currentExpiresAt={null} />,
            { wrapper: createWrapper() }
        )

        await user.click(screen.getByText("Ustaw datę zakończenia"))

        expect(screen.getByRole("button", { name: "Zapisz" })).toBeDisabled()
    })

    it("wywołuje mutate po wybraniu daty i kliknięciu Zapisz", async () => {
        const user = userEvent.setup()

        render(
            <SetExpirationDialog policyId={1} policyName="Polityka podróży" currentExpiresAt={null} />,
            { wrapper: createWrapper() }
        )

        await user.click(screen.getByText("Ustaw datę zakończenia"))

        const dateInput = screen.getByLabelText("Data i czas zakończenia")
        await user.type(dateInput, "2026-12-31T23:59")

        await user.click(screen.getByRole("button", { name: "Zapisz" }))

        expect(mockMutate).toHaveBeenCalledOnce()
        expect(mockMutate.mock.calls[0][0]).toHaveProperty("expiresAt")
    })

    it("zamyka dialog po kliknięciu Anuluj", async () => {
        const user = userEvent.setup()

        render(
            <SetExpirationDialog policyId={1} policyName="Polityka podróży" currentExpiresAt={null} />,
            { wrapper: createWrapper() }
        )

        await user.click(screen.getByText("Ustaw datę zakończenia"))
        expect(screen.getByText("Ustaw datę zakończenia obowiązywania")).toBeInTheDocument()

        await user.click(screen.getByRole("button", { name: "Anuluj" }))

        expect(screen.queryByText("Ustaw datę zakończenia obowiązywania")).not.toBeInTheDocument()
    })
})
