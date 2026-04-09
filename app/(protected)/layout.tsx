import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 flex flex-col min-h-dvh pl-2 sm:pl-0">
                    <header className="h-14 flex items-center gap-2 border-b px-4">
                        <SidebarTrigger />
                    </header>
                    <main className="flex-1 bg-muted/20">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    )
}

