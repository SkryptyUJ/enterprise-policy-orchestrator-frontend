import { describe, it, expect, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { useCreateExpenseRequest } from "./useCreateExpenseRequest"

vi.mock("@/lib/useApiClient", () => ({
    useApiClient: () => ({
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
            id: "abc-123",
            amount: 1500,
            category: "Podróż służbowa",
            description: "Bilety",
            expenseDate: "2026-03-20",
            createdAt: "2026-03-26T10:00:00Z",
        }),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    }),
}))

vi.mock("@/features/auth/hooks/useAuth", () => ({
    useAuth: () => ({
        user: { id: "1", email: "test@example.com", name: "Test", role: "manager" },
        isLoading: false,
    }),
}))

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { mutations: { retry: false } },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe("useCreateExpenseRequest", () => {
    it("wywołuje mutację i zwraca wynik", async () => {
        const { result } = renderHook(() => useCreateExpenseRequest(), {
            wrapper: createWrapper(),
        })

        result.current.mutate({
            amount: 1500,
            category: "Podróż służbowa",
            description: "Bilety",
            expenseDate: "2026-03-20",
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(
            expect.objectContaining({ id: "abc-123", amount: 1500 })
        )
    })
})
