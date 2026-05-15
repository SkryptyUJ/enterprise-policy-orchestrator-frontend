"use client"

import { useMemo } from "react"
import { createApiClient } from "./apiClient"

export function useApiClient() {
    return useMemo(() => {
        return createApiClient(async () => {
            // TODO: zastąp po instalacji @auth0/nextjs-auth0:
            // const { getAccessTokenSilently } = useAuth0()
            // return getAccessTokenSilently()
            return "placeholder-token"
        })
    }, [])
}
