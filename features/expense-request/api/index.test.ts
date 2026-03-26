import { describe, it, expect, vi } from "vitest"
import { createExpenseRequest, type CreateExpenseRequestDto } from "./index"

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

        const result = await createExpenseRequest(mockClient, "1", mockDto)

        expect(mockClient.post).toHaveBeenCalledOnce()
        expect(mockClient.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/users/1/expense-requests",
            mockDto
        )
        expect(result).toEqual(mockResponse)
    })

    it("przekazuje userId w URL", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn().mockResolvedValue(mockResponse),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await createExpenseRequest(mockClient, "42", mockDto)

        expect(mockClient.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/users/42/expense-requests",
            mockDto
        )
    })

    it("propaguje błąd z klienta API", async () => {
        const mockClient = {
            get: vi.fn(),
            post: vi.fn().mockRejectedValue(new Error("Request failed: 500")),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        }

        await expect(createExpenseRequest(mockClient, "1", mockDto)).rejects.toThrow(
            "Request failed: 500"
        )
    })
})
