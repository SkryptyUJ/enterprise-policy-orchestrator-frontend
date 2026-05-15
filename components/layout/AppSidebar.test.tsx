import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AppSidebar } from "./AppSidebar"

const mockUseAuth = vi.fn()

vi.mock("@/features/auth/hooks/useAuth", () => ({
    useAuth: () => mockUseAuth(),
}))

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("@/components/ui/sidebar", () => ({
    Sidebar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarGroupContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SidebarMenuButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe("AppSidebar", () => {
    it("pokazuje pozycje admina", async () => {
        const user = userEvent.setup()

        mockUseAuth.mockReturnValue({
            user: { id: "1", email: "admin@example.com", name: "Admin", roles: ["admin"] },
            isLoading: false,
        })

        render(<AppSidebar />)

        await user.click(screen.getByRole("button", { name: /wydatki/i }))
        await user.click(screen.getByRole("button", { name: /polityki/i }))

        expect(screen.getByText("Nowa polityka")).toBeInTheDocument()
        expect(screen.getByText("Wszystkie polityki")).toBeInTheDocument()
        expect(screen.getByText("Historia wnioskow")).toBeInTheDocument()
    })

    it("ukrywa pozycje admina dla pracownika", async () => {
        const user = userEvent.setup()

        mockUseAuth.mockReturnValue({
            user: { id: "1", email: "employee@example.com", name: "Employee", roles: ["employee"] },
            isLoading: false,
        })

        render(<AppSidebar />)

        await user.click(screen.getByRole("button", { name: /wydatki/i }))
        await user.click(screen.getByRole("button", { name: /polityki/i }))

        expect(screen.getByText("Nowy wniosek")).toBeInTheDocument()
        expect(screen.getByText("Historia wnioskow")).toBeInTheDocument()
        expect(screen.getByText("Wszystkie polityki")).toBeInTheDocument()
        expect(screen.queryByText("Nowa polityka")).not.toBeInTheDocument()
    })

    it("nie renderuje nawigacji podczas ładowania", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoading: true,
        })

        const { container } = render(<AppSidebar />)

        expect(container).toBeEmptyDOMElement()
    })
})
