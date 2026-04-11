import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ExpenseRequestHistoryList, sortRequests } from "./ExpenseRequestHistoryList"
import { useExpenseRequestDetails, useExpenseRequests } from "../hooks/useExpenseRequests"

vi.mock("../hooks/useExpenseRequests", () => ({
    useExpenseRequests: vi.fn(),
    useExpenseRequestDetails: vi.fn(),
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
                    amount: 123,
                    category: "Transport",
                    description: "Taxi",
                    expenseDate: "2026-03-20",
                    createdAt: "2026-03-21T10:00:00Z",
                },
                {
                    id: "exp-2",
                    amount: 45,
                    category: "Wyżywienie",
                    description: "Lunch",
                    expenseDate: "2026-03-22",
                    createdAt: "2026-03-22T10:00:00Z",
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

    it("sortuje listę lokalnie według wybranego pola", () => {
        const sorted = sortRequests(
            [
                {
                    id: "exp-1",
                    amount: 123,
                    category: "Transport",
                    description: "Taxi",
                    expenseDate: "2026-03-20",
                    createdAt: "2026-03-21T10:00:00Z",
                },
                {
                    id: "exp-2",
                    amount: 45,
                    category: "Wyżywienie",
                    description: "Lunch",
                    expenseDate: "2026-03-22",
                    createdAt: "2026-03-22T10:00:00Z",
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
                    amount: 123,
                    category: "Transport",
                    description: "Taxi",
                    expenseDate: "2026-03-20",
                    createdAt: "2026-03-21T10:00:00Z",
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

