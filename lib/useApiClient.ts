"use client"

import { getAccessToken } from "@auth0/nextjs-auth0/client"
import { useMemo } from "react"
import { createApiClient } from "./apiClient"

export function useApiClient() {
    const audience =
        process.env.NEXT_PUBLIC_AUTH0_AUDIENCE?.trim() ||
        process.env.NEXT_PUBLIC_API_URL?.trim()

    return useMemo(() => {
        return createApiClient(async () => {
            const token = audience
                ? await getAccessToken({ audience })
                : await getAccessToken()

            if (!token) {
                throw new Error("Nie udalo sie pobrac access tokena z Auth0.")
            }

            const tokenParts = token.split(".")
            if (tokenParts.length !== 3) {
                throw new Error(
                    "Access token z Auth0 nie jest JWT. Ustaw NEXT_PUBLIC_AUTH0_AUDIENCE/AUTH0_AUDIENCE na identyfikator API w Auth0."
                )
            }

            return token
        })
    }, [audience])
}
