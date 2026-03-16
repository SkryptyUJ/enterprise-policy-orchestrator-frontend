type GetToken = () => Promise<string>

type RequestOptions = Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>
}

export function createApiClient(getToken: GetToken) {
    async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const token = await getToken()

        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        })

        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)

        return res.json()
    }

    return {
        get: <T>(url: string) => request<T>(url),
        post: <T>(url: string, body: unknown) => request<T>(url, { method: "POST", body: JSON.stringify(body) }),
        put: <T>(url: string, body: unknown) => request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
        patch: <T>(url: string, body: unknown) => request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
        delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
    }
}
