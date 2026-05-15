"use client";

import { ShieldAlert } from "lucide-react";

interface AccessDeniedProps {
    title?: string;
    description?: string;
}

export function AccessDenied({
    title = "Brak dostępu",
    description = "Nie masz uprawnień do wyświetlenia tej sekcji.",
}: AccessDeniedProps) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center p-6">
            <div className="max-w-md rounded-xl border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                    <ShieldAlert className="size-6 text-destructive" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
