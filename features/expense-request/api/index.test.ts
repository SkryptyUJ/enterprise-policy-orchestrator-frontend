import { describe, it, expect, vi } from "vitest"
import {
    createExpenseRequest,
    fetchExpenseRequests,
    fetchExpenseRequestDetails,
    type CreateExpenseRequestDto,
} from "./index"

describe("createExpenseRequest", () => {
    const mockDto: CreateExpenseRequestDto = {
        amount: 1500,
        category: "Podróż służbowa",
        description: "Bilety kolejowe do Krakowa",
        expenseDate: "2026-03-20",
    }

    const mockResponse = {
        id: "abc-123",
        ...mockDto,
        createdAt: "2026-03-26T10:00:00Z",
    }

    it("wysyła POST na poprawny URL z danymi", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn().mockResolvedValue(mockResponse),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        const result = await createExpenseRequest(mockClient, "user-123", mockDto)

        expect(mockClient.post).toHaveBeenCalledOnce()
        expect(mockClient.post).toHaveBeenCalledWith("http://localhost:8080/api/users/user-123/expense-requests", mockDto)
        expect(result).toEqual(mockResponse)
    })

    it("używa wspólnego endpointu bez userId", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn().mockResolvedValue(mockResponse),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await createExpenseRequest(mockClient, "user-123", mockDto)

        expect(mockClient.post).toHaveBeenCalledWith("http://localhost:8080/api/users/user-123/expense-requests", mockDto)
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

        expect(mockClient.get).toHaveBeenCalledWith("http://localhost:8080/api/expense-requests")
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

        await fetchExpenseRequestDetails(mockClient, "user-123", "exp-1")

        expect(mockClient.get).toHaveBeenCalledWith("http://localhost:8080/api/user-123/expense-requests/exp-1")
    })
})

