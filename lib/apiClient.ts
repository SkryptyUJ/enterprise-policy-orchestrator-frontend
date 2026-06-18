type GetToken = () => Promise<string>

type RequestOptions = Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>
}

export class ApiError extends Error {
    status: number

    constructor(status: number, statusText: string) {
        super(`Request failed: ${status} ${statusText}`)
        this.name = "ApiError"
        this.status = status
    }
}

export function createApiClient(getToken: GetToken) {
    async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const token = await getToken()
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`

        const res = await fetch(fullUrl, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        })

        if (!res.ok) throw new ApiError(res.status, res.statusText)

        if (res.status === 204) {
            return undefined as T
        }

        const text = await res.text()
        if (!text) {
            return undefined as T
        }

        return JSON.parse(text) as T
    }

    return {
        get: <T>(url: string) => request<T>(url),
        post: <T>(url: string, body: unknown) => request<T>(url, { method: "POST", body: JSON.stringify(body) }),
        put: <T>(url: string, body: unknown) => request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
        patch: <T>(url: string, body: unknown) => request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
        delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
    }
}
