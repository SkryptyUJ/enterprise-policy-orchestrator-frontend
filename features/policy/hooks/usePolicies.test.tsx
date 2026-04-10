import { describe, it, expect, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { useAllPolicies, useSetPolicyExpiration } from "./usePolicies"

const mockPolicies = [
    {
        id: 1,
        policyId: null,
        authorUserId: 1,
        categoryId: 1,
        name: "Polityka podróży",
        description: null,
        version: 1,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        startsAt: "2026-01-01T00:00:00Z",
        expiresAt: null,
        minPrice: null,
        maxPrice: null,
        category: 1,
        authorizedRole: 2,
        isValid: true,
    },
]

const mockGet = vi.fn().mockResolvedValue(mockPolicies)
const mockPatch = vi.fn().mockResolvedValue({ ...mockPolicies[0], expiresAt: "2026-12-31T23:59:00Z" })

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
    useAuth: () => ({
        user: { id: "auth0|00000001", email: "test@example.com", name: "Test", roles: ["admin"] },
        isLoading: false,
    }),
}))

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe("useAllPolicies", () => {
    it("pobiera wszystkie polityki", async () => {
        const { result } = renderHook(() => useAllPolicies(), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockPolicies)
        expect(mockGet).toHaveBeenCalledWith("/api/users/1/policies")
    })
})

describe("useSetPolicyExpiration", () => {
    it("wywołuje mutację z poprawną datą", async () => {
        const { result } = renderHook(() => useSetPolicyExpiration(5), {
            wrapper: createWrapper(),
        })

        result.current.mutate({ expiresAt: "2026-12-31T23:59:00.000Z" })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(mockPatch).toHaveBeenCalledWith(
            "/api/users/1/policies/5/expiration",
            { expiresAt: "2026-12-31T23:59:00.000Z" }
        )
    })
})
