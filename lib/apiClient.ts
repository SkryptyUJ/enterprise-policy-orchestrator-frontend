type GetToken = () => Promise<string>

type RequestOptions = Omit<RequestInit, "headers"> & {
    headers?: Record<string, string>
}

export class ApiClientError extends Error {
    status: number
    statusText: string
    data?: unknown

    constructor(status: number, statusText: string, message: string, data?: unknown) {
        super(message)
        this.name = "ApiClientError"
        this.status = status
        this.statusText = statusText
        this.data = data
    }
}

async function readResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type") ?? ""

    if (contentType.includes("application/json")) {
        try {
            return await response.json()
        } catch {
            return null
        }
    }

    try {
        const text = await response.text()
        return text || null
    } catch {
        return null
    }
}

function extractErrorMessage(data: unknown): string | null {
    if (!data) {
        return null
    }

    if (typeof data === "string") {
        return data.trim() || null
    }

    if (typeof data === "object") {
        const payload = data as { message?: unknown; error?: unknown }

        if (typeof payload.message === "string" && payload.message.trim()) {
            return payload.message
        }

        if (typeof payload.error === "string" && payload.error.trim()) {
            return payload.error
        }
    }

    return null
}

export function createApiClient(getToken: GetToken) {
    async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const token = await getToken()
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
        const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`

        const res = await fetch(fullUrl, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        })

        if (!res.ok) {
            const errorData = await readResponseBody(res)
            const errorMessage = extractErrorMessage(errorData) ?? `Request failed: ${res.status} ${res.statusText}`

            throw new ApiClientError(res.status, res.statusText, errorMessage, errorData)
        }

        if (res.status === 204) {
            return undefined as T
        }

        const data = await readResponseBody(res)
        return data as T
    }

    return {
        get: <T>(url: string, options?: RequestOptions) => request<T>(url, options),
        post: <T>(url: string, body: unknown, options: RequestOptions = {}) =>
            request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
        put: <T>(url: string, body: unknown, options: RequestOptions = {}) =>
            request<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
        patch: <T>(url: string, body: unknown, options: RequestOptions = {}) =>
            request<T>(url, { ...options, method: "PATCH", body: JSON.stringify(body) }),
        delete: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: "DELETE" }),
    }
}
