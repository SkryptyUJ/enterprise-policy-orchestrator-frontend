import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { PolicyList } from "./PolicyList"

const mockActivePolicies = [
    {
        id: 1,
        name: "Polityka podróży",
        isValid: true,
        startsAt: "2026-01-01T00:00:00Z",
        expiresAt: null,
        minPrice: 100,
        maxPrice: 5000,
    },
    {
        id: 2,
        name: "Polityka szkoleniowa",
        isValid: true,
        startsAt: "2025-01-01T00:00:00Z",
        expiresAt: "2025-06-01T00:00:00Z",
        minPrice: null,
        maxPrice: null,
    },
]

let mockReturn: { data: unknown; isLoading: boolean; isError: boolean }

vi.mock("../hooks/usePolicies", () => ({
    useAllPolicies: () => mockReturn,
}))

function createWrapper() {
    const queryClient = new QueryClient()
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe("PolicyList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockReturn = { data: mockActivePolicies, isLoading: false, isError: false }
    })

    it("renderuje tabelę z politykami", () => {
        render(<PolicyList />, { wrapper: createWrapper() })

        expect(screen.getByText("Polityka podróży")).toBeInTheDocument()
        expect(screen.getByText("Polityka szkoleniowa")).toBeInTheDocument()
    })

    it("wyświetla nagłówki kolumn", () => {
        render(<PolicyList />, { wrapper: createWrapper() })

        expect(screen.getByText("Nazwa")).toBeInTheDocument()
        expect(screen.getByText("Status")).toBeInTheDocument()
        expect(screen.getByText("Obowiązuje od")).toBeInTheDocument()
        expect(screen.getByText("Wygasa")).toBeInTheDocument()
    })

    it("pokazuje status Aktywna dla aktywnej polityki", () => {
        render(<PolicyList />, { wrapper: createWrapper() })

        expect(screen.getByText("Aktywna")).toBeInTheDocument()
    })

    it("pokazuje status Wygasła dla polityki z datą expiresAt w przeszłości", () => {
        render(<PolicyList />, { wrapper: createWrapper() })

        expect(screen.getByText("Wygasła")).toBeInTheDocument()
    })

    it("wyświetla spinner podczas ładowania", () => {
        mockReturn = { data: undefined, isLoading: true, isError: false }

        const { container } = render(<PolicyList />, { wrapper: createWrapper() })

        expect(container.querySelector(".animate-spin")).toBeInTheDocument()
    })

    it("wyświetla komunikat błędu", () => {
        mockReturn = { data: undefined, isLoading: false, isError: true }

        render(<PolicyList />, { wrapper: createWrapper() })

        expect(screen.getByText("Nie udało się pobrać listy polityk.")).toBeInTheDocument()
    })

    it("wyświetla komunikat gdy brak polityk", () => {
        mockReturn = { data: [], isLoading: false, isError: false }

        render(<PolicyList />, { wrapper: createWrapper() })

        expect(screen.getByText("Brak polityk w systemie.")).toBeInTheDocument()
    })

    it("wyświetla linki do szczegółów polityk", () => {
        render(<PolicyList />, { wrapper: createWrapper() })

        const links = screen.getAllByText("Szczegóły")
        expect(links).toHaveLength(2)
    })
})
