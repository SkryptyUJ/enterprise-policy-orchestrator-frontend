import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { ExpenseRequestForm } from "./ExpenseRequestForm"

const mockPush = vi.fn()
const mockBack = vi.fn()
const mockMutate = vi.fn()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, back: mockBack }),
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock("../hooks/useCreateExpenseRequest", () => ({
    useCreateExpenseRequest: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
}))

function createWrapper() {
    const queryClient = new QueryClient()
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe("ExpenseRequestForm", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renderuje wszystkie pola formularza", () => {
        render(<ExpenseRequestForm />, { wrapper: createWrapper() })

        expect(screen.getByText("Nowy wniosek wydatkowy")).toBeInTheDocument()
        expect(screen.getByLabelText(/kwota/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/data wydatku/i)).toBeInTheDocument()
        expect(screen.getByText(/kategoria/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/opis/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /złóż wniosek/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /anuluj/i })).toBeInTheDocument()
    })

    it("wypełnia pola kwoty, daty i opisu", async () => {
        const user = userEvent.setup()
        render(<ExpenseRequestForm />, { wrapper: createWrapper() })

        const amountInput = screen.getByLabelText(/kwota/i)
        await user.clear(amountInput)
        await user.type(amountInput, "1500")
        expect(amountInput).toHaveValue(1500)

        const descInput = screen.getByLabelText(/opis/i)
        await user.type(descInput, "Podróż służbowa do Krakowa")
        expect(descInput).toHaveValue("Podróż służbowa do Krakowa")
    })

    it("przycisk Anuluj wywołuje router.back()", async () => {
        const user = userEvent.setup()
        render(<ExpenseRequestForm />, { wrapper: createWrapper() })

        await user.click(screen.getByRole("button", { name: /anuluj/i }))
        expect(mockBack).toHaveBeenCalledOnce()
    })

    it("wywołuje mutate z poprawnymi danymi po submicie", async () => {
        const user = userEvent.setup()
        render(<ExpenseRequestForm />, { wrapper: createWrapper() })

        const amountInput = screen.getByLabelText(/kwota/i)
        await user.clear(amountInput)
        await user.type(amountInput, "1500")

        const descInput = screen.getByLabelText(/opis/i)
        await user.type(descInput, "Podróż służbowa")

        await user.click(screen.getByRole("button", { name: /złóż wniosek/i }))

        expect(mockMutate).toHaveBeenCalledOnce()
        const [payload] = mockMutate.mock.calls[0]
        expect(payload.amount).toBe(1500)
        expect(payload.description).toBe("Podróż służbowa")
        expect(payload.expenseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it("ustawia dzisiejszą datę jako domyślną", () => {
        render(<ExpenseRequestForm />, { wrapper: createWrapper() })

        const dateInput = screen.getByLabelText(/data wydatku/i)
        const today = new Date().toISOString().slice(0, 10)
        expect(dateInput).toHaveValue(today)
    })
})
