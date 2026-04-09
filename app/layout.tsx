import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import TanstackQueryProvider from "@/providers/tanstackQuery"
import { Toaster } from "@/components/ui/sonner"
import { Auth0Provider } from '@auth0/nextjs-auth0/client'

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
                <TanstackQueryProvider>
                    <Auth0Provider>
                        {children}
                    </Auth0Provider>
                </TanstackQueryProvider>
                <Toaster position="top-right" richColors />
            </body>
        </html>
    )
}