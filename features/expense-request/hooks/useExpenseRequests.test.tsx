import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { useExpenseRequestDetails, useExpenseRequests } from "./useExpenseRequests"

const mockGet = vi.fn()

vi.mock("@/lib/useApiClient", () => ({
	useApiClient: () => ({
		get: mockGet,
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	}),
}))

vi.mock("@/features/auth/hooks/useAuth", () => ({
	useAuth: () => ({
		user: { id: "1", email: "test@example.com", name: "Test", roles: ["employee"] },
		isLoading: false,
	}),
}))

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	})

	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

describe("useExpenseRequests", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("pobiera liste bez parametrów", async () => {
		mockGet.mockResolvedValueOnce([])

		const { result } = renderHook(() => useExpenseRequests(), {
			wrapper: createWrapper(),
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(mockGet).toHaveBeenCalledWith("http://localhost:8080/api/expense-requests")
	})

	it("pobiera szczegoly wskazanego wniosku", async () => {
		mockGet.mockResolvedValueOnce({ id: "exp-1" })

		const { result } = renderHook(() => useExpenseRequestDetails("exp-1"), {
			wrapper: createWrapper(),
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(mockGet).toHaveBeenCalledWith("http://localhost:8080/api/expense-requests/exp-1")
	})
})

