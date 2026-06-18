import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ExpenseRequestHistoryList, sortRequests } from "./ExpenseRequestHistoryList"
import { useExpenseRequestDetails, useExpenseRequests } from "../hooks/useExpenseRequests"

vi.mock("@/features/auth/hooks/useAuth", () => ({
    useAuth: () => ({
        user: { id: "1", email: "test@example.com", name: "Test", roles: ["employee"] },
        isLoading: false,
    }),
}))

vi.mock("@/features/categories/hooks/useCategories", () => ({
    useCategories: () => ({
        data: [
            { id: 1, label: "Transport" },
            { id: 2, label: "Wyżywienie" },
        ],
        isLoading: false,
    }),
}))

vi.mock("../hooks/useExpenseRequests", () => ({
    useExpenseRequests: vi.fn(),
    useExpenseRequestDetails: vi.fn(),
    useApproveExpenseRequest: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useDeclineExpenseRequest: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}))

vi.mock("./ExpenseRequestDetailsSheet", () => ({
    ExpenseRequestDetailsSheet: () => <div data-testid="details-sheet" />,
}))

const mockedUseExpenseRequests = vi.mocked(useExpenseRequests)
const mockedUseExpenseRequestDetails = vi.mocked(useExpenseRequestDetails)

describe("ExpenseRequestHistoryList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedUseExpenseRequestDetails.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useExpenseRequestDetails>)
    })

    it("pokazuje stan ladowania", () => {
        mockedUseExpenseRequests.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        } as ReturnType<typeof useExpenseRequests>)

        render(<ExpenseRequestHistoryList />)

        expect(screen.getByText("Ładowanie historii...")).toBeInTheDocument()
    })

    it("renderuje pusta liste", () => {
        mockedUseExpenseRequests.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useExpenseRequests>)

        render(<ExpenseRequestHistoryList />)

        expect(screen.getByText("Brak wniosków dla wybranych filtrów.")).toBeInTheDocument()
    })

    it("filtruje listę lokalnie po wpisaniu wyszukiwania", async () => {
        const user = userEvent.setup()

        mockedUseExpenseRequests.mockReturnValue({
            data: [
                {
                    id: "exp-1",
                    userId: "user-1",
                    amount: 123,
                    categoryId: 1,
                    categoryLabel: "Transport",
                    description: "Taxi",
                    expenseDate: "2026-03-20",
                    submittedAt: "2026-03-21T10:00:00Z",
                },
                {
                    id: "exp-2",
                    userId: "user-1",
                    amount: 45,
                    categoryId: 2,
                    categoryLabel: "Wyżywienie",
                    description: "Lunch",
                    expenseDate: "2026-03-22",
                    submittedAt: "2026-03-22T10:00:00Z",
                },
            ],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useExpenseRequests>)

        render(<ExpenseRequestHistoryList />)

        await user.type(screen.getByLabelText(/wyszukaj/i), "taxi")

        expect(screen.getByRole("button", { name: /taxi/i })).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: /lunch/i })).not.toBeInTheDocument()
    })

    it("filtruje listę po wybranej kategorii", async () => {
        const user = userEvent.setup()

        mockedUseExpenseRequests.mockReturnValue({
            data: [
                {
                    id: "exp-1",
                    userId: "user-1",
                    amount: 123,
                    categoryId: 1,
                    categoryLabel: "Transport",
                    description: "Taxi",
                    expenseDate: "2026-03-20",
                    submittedAt: "2026-03-21T10:00:00Z",
                },
                {
                    id: "exp-2",
                    userId: "user-1",
                    amount: 45,
                    categoryId: 2,
                    categoryLabel: "Wyżywienie",
                    description: "Lunch",
                    expenseDate: "2026-03-22",
                    submittedAt: "2026-03-22T10:00:00Z",
                },
            ],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useExpenseRequests>)

        render(<ExpenseRequestHistoryList />)

        await user.click(screen.getByRole("combobox", { name: /kategoria/i }))
        await user.click(await screen.findByRole("option", { name: "Transport" }))

        expect(screen.getByRole("button", { name: /taxi/i })).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: /lunch/i })).not.toBeInTheDocument()
    })

    it("sortuje listę lokalnie według wybranego pola", () => {
        const sorted = sortRequests(
            [
                {
                    id: "exp-1",
                    userId: "user-1",
                    amount: 123,
                    categoryId: 1,
                    categoryLabel: "Transport",
                    description: "Taxi",
                    expenseDate: "2026-03-20",
                    submittedAt: "2026-03-21T10:00:00Z",
                },
                {
                    id: "exp-2",
                    userId: "user-1",
                    amount: 45,
                    categoryId: 2,
                    categoryLabel: "Wyżywienie",
                    description: "Lunch",
                    expenseDate: "2026-03-22",
                    submittedAt: "2026-03-22T10:00:00Z",
                },
            ],
            "amount",
            "asc"
        )

        expect(sorted.map((item) => item.id)).toEqual(["exp-2", "exp-1"])
    })

    it("po kliknieciu elementu ustawia id do pobrania szczegolow", async () => {
        const user = userEvent.setup()

        mockedUseExpenseRequests.mockReturnValue({
            data: [
                {
                    id: "exp-1",
                    userId: "user-1",
                    amount: 123,
                    categoryId: 1,
                    categoryLabel: "Transport",
                    description: "Taxi",
                    expenseDate: "2026-03-20",
                    submittedAt: "2026-03-21T10:00:00Z",
                },
            ],
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useExpenseRequests>)

        mockedUseExpenseRequestDetails.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        } as ReturnType<typeof useExpenseRequestDetails>)

        render(<ExpenseRequestHistoryList />)

        await user.click(screen.getByRole("button", { name: /taxi/i }))

        await waitFor(() => {
            expect(mockedUseExpenseRequestDetails).toHaveBeenLastCalledWith("exp-1")
        })
    })
})
