import { useState, useMemo } from 'react'
import { Policy } from '../api'

const mockVersions: Policy[] = [
    {
        id: 1,
        policyId: 100,
        authorUserId: 10,
        categoryId: 1,
        name: "Standard Policy v1",
        description: "Initial version",
        version: 1,
        createdAt: "2026-01-01T10:00:00Z",
        updatedAt: "2026-01-01T10:00:00Z",
        startsAt: "2026-01-01T00:00:00Z",
        expiresAt: "2026-03-01T23:59:59Z",
        minPrice: 100,
        maxPrice: 500,
        category: 1,
        authorizedRole: 2,
        isValid: true
    },
    {
        id: 2,
        policyId: 100,
        authorUserId: 11,
        categoryId: 1,
        name: "Standard Policy v2",
        description: "Updated price range",
        version: 2,
        createdAt: "2026-02-15T10:00:00Z",
        updatedAt: "2026-02-15T12:00:00Z",
        startsAt: "2026-03-02T00:00:00Z",
        expiresAt: "2026-06-01T23:59:59Z",
        minPrice: 150,
        maxPrice: 600,
        category: 1,
        authorizedRole: 2,
        isValid: true
    },
    {
        id: 3,
        policyId: 100,
        authorUserId: 10,
        categoryId: 1,
        name: "Premium Policy",
        description: "Renamed and modified role",
        version: 3,
        createdAt: "2026-05-10T09:00:00Z",
        updatedAt: "2026-05-10T10:00:00Z",
        startsAt: "2026-06-02T00:00:00Z",
        expiresAt: "2026-12-31T23:59:59Z",
        minPrice: 150,
        maxPrice: 600,
        category: 1,
        authorizedRole: 3,
        isValid: true
    }
]

export function usePolicyVersions(policyId: number) {
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    })

    const versions = useMemo(() => {
        let filtered = mockVersions.filter(v => v.policyId === policyId)

        if (dateRange.start) {
            filtered = filtered.filter(v =>
                v.expiresAt && new Date(v.expiresAt) >= new Date(dateRange.start)
            )
        }

        if (dateRange.end) {
            filtered = filtered.filter(v =>
                v.startsAt && new Date(v.startsAt) <= new Date(dateRange.end)
            )
        }

        return filtered.sort((a, b) => (b.version || 0) - (a.version || 0))
    }, [policyId, dateRange])

    return {
        versions,
        allVersions: mockVersions.filter(v => v.policyId === policyId).sort((a, b) => (a.version || 0) - (b.version || 0)),
        dateRange,
        setDateRange,
        isLoading: false,
    }
}
