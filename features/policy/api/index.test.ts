import { describe, it, expect, vi } from "vitest"
import { getAllPolicies, setPolicyExpiration, type Policy, type SetPolicyExpirationDto } from "./index"

function createMockClient() {
    return {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    }
}

const mockPolicy: Policy = {
    id: 1,
    policyId: null,
    authorUserId: 1,
    categoryId: 1,
    name: "Polityka podróży",
    description: "Zasady rozliczania podróży służbowych",
    version: 1,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: null,
    minPrice: 100,
    maxPrice: 5000,
    category: 1,
    authorizedRole: 2,
    isValid: true,
}

describe("getAllPolicies", () => {
    it("wysyła GET na poprawny URL z userId", async () => {
        const client = createMockClient()
        client.get.mockResolvedValue([mockPolicy])

        const result = await getAllPolicies(client, 1)

        expect(client.get).toHaveBeenCalledOnce()
        expect(client.get).toHaveBeenCalledWith("/api/users/1/policies")
        expect(result).toEqual([mockPolicy])
    })

    it("przekazuje userId w URL", async () => {
        const client = createMockClient()
        client.get.mockResolvedValue([])

        await getAllPolicies(client, 42)

        expect(client.get).toHaveBeenCalledWith("/api/users/42/policies")
    })

    it("propaguje błąd z klienta API", async () => {
        const client = createMockClient()
        client.get.mockRejectedValue(new Error("Request failed: 500"))

        await expect(getAllPolicies(client, 1)).rejects.toThrow("Request failed: 500")
    })
})

describe("setPolicyExpiration", () => {
    const expirationDto: SetPolicyExpirationDto = {
        expiresAt: "2026-12-31T23:59:00.000Z",
    }

    it("wysyła PATCH na poprawny URL z danymi", async () => {
        const client = createMockClient()
        const updatedPolicy = { ...mockPolicy, expiresAt: expirationDto.expiresAt }
        client.patch.mockResolvedValue(updatedPolicy)

        const result = await setPolicyExpiration(client, 1, 5, expirationDto)

        expect(client.patch).toHaveBeenCalledOnce()
        expect(client.patch).toHaveBeenCalledWith(
            "/api/users/1/policies/5/expiration",
            expirationDto
        )
        expect(result).toEqual(updatedPolicy)
    })

    it("przekazuje userId i policyId w URL", async () => {
        const client = createMockClient()
        client.patch.mockResolvedValue(mockPolicy)

        await setPolicyExpiration(client, 42, 99, expirationDto)

        expect(client.patch).toHaveBeenCalledWith(
            "/api/users/42/policies/99/expiration",
            expirationDto
        )
    })

    it("propaguje błąd z klienta API", async () => {
        const client = createMockClient()
        client.patch.mockRejectedValue(new Error("Request failed: 404"))

        await expect(setPolicyExpiration(client, 1, 999, expirationDto)).rejects.toThrow(
            "Request failed: 404"
        )
    })
})
