import { describe, it, expect, vi } from "vitest"
import {
    approveExpenseRequest,
    createExpenseRequest,
    declineExpenseRequest,
    fetchExpenseRequests,
    fetchExpenseRequestsForReview,
    fetchExpenseRequestDetails,
    fetchExpenseRequestDetailsForReview,
    type CreateExpenseRequestDto,
} from "./index"

describe("createExpenseRequest", () => {
    const mockDto: CreateExpenseRequestDto = {
        amount: 1500,
        categoryId: 1,
        description: "Bilety kolejowe do Krakowa",
        expenseDate: "2026-03-20T00:00:00",
    }

    const mockResponse = {
        id: "abc-123",
        userId: "user-123",
        ...mockDto,
        submittedAt: "2026-03-26T10:00:00Z",
    }

    it("wysyła POST na poprawny URL z danymi", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn().mockResolvedValue(mockResponse),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        const result = await createExpenseRequest(mockClient, mockDto)

        expect(mockClient.post).toHaveBeenCalledOnce()
        expect(mockClient.post).toHaveBeenCalledWith("/api/expense-requests", mockDto)
        expect(result).toEqual(mockResponse)
    })

    it("propaguje błąd z klienta API", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn().mockRejectedValue(new Error("Request failed: 500")),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await expect(createExpenseRequest(mockClient, mockDto)).rejects.toThrow("Request failed: 500")
    })
})

describe("fetchExpenseRequests", () => {
    it("wysyła GET na poprawny URL", async () => {
        const mockClient = {
            get: vi.fn().mockResolvedValue([]),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await fetchExpenseRequests(mockClient)

        expect(mockClient.get).toHaveBeenCalledWith("/api/expense-requests")
    })
})

describe("fetchExpenseRequestsForReview", () => {
    it("wysyła GET na endpoint review", async () => {
        const mockClient = {
            get: vi.fn().mockResolvedValue([]),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await fetchExpenseRequestsForReview(mockClient)

        expect(mockClient.get).toHaveBeenCalledWith("/api/expense-requests/review")
    })
})

describe("fetchExpenseRequestDetails", () => {
    it("wysyła GET na endpoint szczegółów", async () => {
        const mockClient = {
            get: vi.fn().mockResolvedValue({ id: "exp-1" }),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await fetchExpenseRequestDetails(mockClient, "exp-1")

        expect(mockClient.get).toHaveBeenCalledWith("/api/expense-requests/exp-1")
    })
})

describe("fetchExpenseRequestDetailsForReview", () => {
    it("wysyła GET na endpoint szczegółów review", async () => {
        const mockClient = {
            get: vi.fn().mockResolvedValue({ id: "exp-1" }),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await fetchExpenseRequestDetailsForReview(mockClient, "exp-1")

        expect(mockClient.get).toHaveBeenCalledWith("/api/expense-requests/review/exp-1")
    })
})

describe("approveExpenseRequest", () => {
    it("wysyła PATCH z uzasadnieniem decyzji", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn().mockResolvedValue({ id: "exp-1", status: "APPROVED" }),
            delete: vi.fn(),
        }

        await approveExpenseRequest(mockClient, "exp-1", {
            decisionRationale: "Zgodne z polityką",
        })

        expect(mockClient.patch).toHaveBeenCalledWith(
            "/api/expense-requests/review/exp-1/approve",
            { decisionRationale: "Zgodne z polityką" }
        )
    })
})

describe("declineExpenseRequest", () => {
    it("wysyła PATCH z uzasadnieniem decyzji dla odrzucenia", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn().mockResolvedValue({ id: "exp-1", status: "DECLINED" }),
            delete: vi.fn(),
        }

        await declineExpenseRequest(mockClient, "exp-1", {
            decisionRationale: "Poza zakresem polityki",
        })

        expect(mockClient.patch).toHaveBeenCalledWith(
            "/api/expense-requests/review/exp-1/decline",
            { decisionRationale: "Poza zakresem polityki" }
        )
    })
})
