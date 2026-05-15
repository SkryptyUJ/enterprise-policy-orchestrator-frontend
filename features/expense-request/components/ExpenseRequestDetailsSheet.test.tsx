import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ExpenseRequestDetailsSheet } from "./ExpenseRequestDetailsSheet"
import type { ExpenseRequestDetails } from "../api"

const mockMutate = vi.fn()
const mockUseAuth = vi.fn()
const mockUseManagerDecision = vi.fn()

vi.mock("@/features/auth/hooks/useAuth", () => ({
    useAuth: () => mockUseAuth(),
}))

vi.mock("../hooks/useExpenseRequests", () => ({
    useManagerDecision: () => mockUseManagerDecision(),
}))

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}))

const escalatedDetails: ExpenseRequestDetails = {
    id: 77,
    userId: "manager-review-user",
    amount: 1900,
    category: "Travel",
    description: "Flight and hotel in Berlin",
    expenseDate: "2026-04-30T10:00:00",
    submittedAt: "2026-05-01T08:15:00",
    status: "ESCALATED",
    resolutionPolicyId: null,
    conflictingPolicies: [
        {
            id: 11,
            policyId: "TRAVEL-STD",
            name: "Travel Standard",
            description: "Default travel policy",
        },
        {
            id: 12,
            policyId: "TRAVEL-EXT",
            name: "Travel Extended",
            description: "Extended travel policy",
        },
    ],
}

describe("ExpenseRequestDetailsSheet", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mockUseAuth.mockReturnValue({
            user: { id: "1", email: "manager@example.com", name: "Manager", roles: ["manager"] },
            isLoading: false,
        })

        mockUseManagerDecision.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        })
    })

    it("pokazuje akcje decyzji dla managera i statusu ESCALATED", async () => {
        const user = userEvent.setup()

        render(
            <ExpenseRequestDetailsSheet
                open
                onOpenChange={vi.fn()}
                details={escalatedDetails}
                isLoading={false}
                isError={false}
            />
        )

        const approveButton = await screen.findByRole("button", { name: "Zatwierdź" })

        await waitFor(() => expect(approveButton).toBeEnabled())
        await user.click(approveButton)

        expect(mockMutate).toHaveBeenCalledOnce()
        expect(mockMutate.mock.calls[0][0]).toEqual({ policyId: 11, decision: "APPROVE" })
    })

    it("nie pokazuje akcji decyzji dla statusu innego niż ESCALATED", () => {
        render(
            <ExpenseRequestDetailsSheet
                open
                onOpenChange={vi.fn()}
                details={{ ...escalatedDetails, status: "APPROVED" }}
                isLoading={false}
                isError={false}
            />
        )

        expect(screen.queryByRole("button", { name: "Zatwierdź" })).not.toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Odrzuć" })).not.toBeInTheDocument()
    })
})
