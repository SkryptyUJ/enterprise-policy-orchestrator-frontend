"use client"

export function LoginView() {
    return (
        <div className="min-h-dvh flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm flex flex-col gap-6">

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Policy Orchestrator</h1>
                    <p className="text-sm text-muted-foreground">Zaloguj się, aby kontynuować</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Zarządzanie kontami odbywa się przez Auth0. Kliknij poniżej, aby przejść do logowania.
                    </p>
                    <a
                        className="w-full"
                        href="/auth/login"
                    >
                        Zaloguj się
                    </a>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    Dostęp tylko dla uprawnionych użytkowników.
                </p>
            </div>
        </div>
    )
}
