import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPolicyHistory } from '../api'
import { useApiClient } from "@/lib/useApiClient"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function usePolicyVersions(policyId: string) {
    const client = useApiClient()
    const { user } = useAuth()

    const { data: allVersionsUnsorted = [], isLoading } = useQuery({
        queryKey: ["policies", "history", policyId],
        queryFn: () => {
            if (!user) throw new Error("Brak zalogowanego użytkownika")
            return getPolicyHistory(client, user.id, policyId)
        },
        enabled: !!user && !!policyId,
    })

    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    })

    const allVersions = useMemo(() => {
        return [...allVersionsUnsorted].sort((a, b) => (a.version || 0) - (b.version || 0))
    }, [allVersionsUnsorted])

    const versions = useMemo(() => {
        let filtered = [...allVersionsUnsorted]

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
    }, [allVersionsUnsorted, dateRange])

    return {
        versions,
        allVersions,
        dateRange,
        setDateRange,
        isLoading,
    }
}
