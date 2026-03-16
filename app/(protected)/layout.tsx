export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-dvh flex flex-col">
            <main className="flex-1">{children}</main>
        </div>
    )
}
