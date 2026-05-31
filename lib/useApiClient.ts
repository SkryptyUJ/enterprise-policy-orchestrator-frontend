"use client"

import { getAccessToken } from "@auth0/nextjs-auth0/client"
import { useMemo } from "react"
import { createApiClient } from "./apiClient"

export function useApiClient() {
    return useMemo(() => {
        return createApiClient(async () => {
            const accessToken = await getAccessToken()

            if (!accessToken) {
                throw new Error("Brak access tokenu Auth0")
            }

            return accessToken
        })
    }, [])
}
