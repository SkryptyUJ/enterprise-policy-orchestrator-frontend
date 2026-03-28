import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import TanstackQueryProvider from "@/providers/tanstackQuery"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Policy Orchestrator",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pl">
            <body className={inter.className}>
                <TanstackQueryProvider>{children}</TanstackQueryProvider>
                <Toaster position="top-right" richColors />
            </body>
        </html>
    )
}