import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import {
	useApproveExpenseRequest,
	useDeclineExpenseRequest,
	useExpenseRequestDetails,
	useExpenseRequests,
} from "./useExpenseRequests"

const mockGet = vi.fn()
const mockPatch = vi.fn()

const authState = {
	user: { id: "1", email: "test@example.com", name: "Test", roles: ["employee"] as string[] },
	isLoading: false,
}

vi.mock("@/lib/useApiClient", () => ({
	useApiClient: () => ({
		get: mockGet,
		post: vi.fn(),
		put: vi.fn(),
		patch: mockPatch,
		delete: vi.fn(),
	}),
}))

vi.mock("@/features/auth/hooks/useAuth", () => ({
	useAuth: () => authState,
}))

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	})

	function TestQueryClientProvider({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		)
	}

	return TestQueryClientProvider
}

describe("useExpenseRequests", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		authState.user = { id: "1", email: "test@example.com", name: "Test", roles: ["employee"] }
	})

	it("pobiera liste bez parametrów", async () => {
		mockGet.mockResolvedValueOnce([])

		const { result } = renderHook(() => useExpenseRequests(), {
			wrapper: createWrapper(),
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(mockGet).toHaveBeenCalledWith("/api/expense-requests")
	})

	it("pobiera szczegoly wskazanego wniosku", async () => {
		mockGet.mockResolvedValueOnce({ id: "exp-1" })

		const { result } = renderHook(() => useExpenseRequestDetails("exp-1"), {
			wrapper: createWrapper(),
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(mockGet).toHaveBeenCalledWith("/api/expense-requests/exp-1")
	})

	it("dla managera pobiera listę w trybie review", async () => {
		authState.user = { ...authState.user, roles: ["manager"] }
		mockGet.mockResolvedValueOnce([])

		const { result } = renderHook(() => useExpenseRequests(), {
			wrapper: createWrapper(),
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(mockGet).toHaveBeenCalledWith("/api/expense-requests/review")
	})

	it("dla managera pobiera szczegóły w trybie review", async () => {
		authState.user = { ...authState.user, roles: ["manager"] }
		mockGet.mockResolvedValueOnce({ id: "exp-1" })

		const { result } = renderHook(() => useExpenseRequestDetails("exp-1"), {
			wrapper: createWrapper(),
		})

		await waitFor(() => expect(result.current.isSuccess).toBe(true))

		expect(mockGet).toHaveBeenCalledWith("/api/expense-requests/review/exp-1")
	})

	it("pozwala managerowi zatwierdzić wniosek z uzasadnieniem", async () => {
		authState.user = { ...authState.user, roles: ["manager"] }
		mockPatch.mockResolvedValueOnce({ id: "exp-1", status: "APPROVED" })

		const { result } = renderHook(() => useApproveExpenseRequest(), {
			wrapper: createWrapper(),
		})

		await act(async () => {
			await result.current.mutateAsync({
				expenseRequestId: "exp-1",
				decisionRationale: "Zgodne z polityką",
			})
		})

		expect(mockPatch).toHaveBeenCalledWith(
			"/api/expense-requests/review/exp-1/approve",
			{ decisionRationale: "Zgodne z polityką" }
		)
	})

	it("pozwala managerowi odrzucić wniosek z uzasadnieniem", async () => {
		authState.user = { ...authState.user, roles: ["manager"] }
		mockPatch.mockResolvedValueOnce({ id: "exp-1", status: "DECLINED" })

		const { result } = renderHook(() => useDeclineExpenseRequest(), {
			wrapper: createWrapper(),
		})

		await act(async () => {
			await result.current.mutateAsync({
				expenseRequestId: "exp-1",
				decisionRationale: "Poza zakresem polityki",
			})
		})

		expect(mockPatch).toHaveBeenCalledWith(
			"/api/expense-requests/review/exp-1/decline",
			{ decisionRationale: "Poza zakresem polityki" }
		)
	})
})
