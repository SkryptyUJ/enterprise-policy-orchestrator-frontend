"use client"

import { ArrowRight, Building2, FileStack, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function LoginView() {
    return (
        <div className="min-h-dvh bg-[#edf1f4] text-slate-950">
            <div className="mx-auto flex min-h-dvh max-w-7xl flex-col border-x border-slate-300/80 bg-[#f7f9fb] lg:grid lg:grid-cols-[1.25fr_0.75fr]">
                <section className="flex flex-col justify-between border-b border-slate-300/80 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-300/80 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center border border-slate-400 bg-white">
                                    <Building2 className="size-5 text-slate-800" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                                        Internal Platform
                                    </p>
                                    <p className="text-sm font-medium text-slate-800">Policy Orchestrator</p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-none border-slate-400 bg-transparent px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-600"
                            >
                                Auth0 SSO
                            </Badge>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                                        Access Control Desk
                                    </p>
                                    <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
                                        Wewnętrzny panel do pracy na politykach i wnioskach.
                                    </h1>
                                </div>
                                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                    System dla użytkowników organizacji. Po zalogowaniu dostęp do widoków i
                                    akcji zostanie dopasowany do przypisanej roli.
                                </p>
                            </div>

                            <div className="border-l border-slate-300/80 pl-6">
                                <div className="space-y-5 text-sm text-slate-600">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <FileStack className="size-4" />
                                            <span className="font-medium">Polityki</span>
                                        </div>
                                        <p className="leading-6">
                                            Wersjonowanie, obowiązywanie w czasie i historia zmian.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <ShieldCheck className="size-4" />
                                            <span className="font-medium">Role firmowe</span>
                                        </div>
                                        <p className="leading-6">
                                            Uprawnienia zależne od roli: pracownik, manager, compliance, admin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-slate-300/80 pt-4 text-xs uppercase tracking-[0.18em] text-slate-500">
                        Dostęp tylko dla uprawnionych użytkowników organizacji
                    </div>
                </section>

                <section className="flex items-center bg-[#f1f4f7] p-6 sm:p-8 lg:p-10">
                    <div className="w-full">
                        <div className="border-y border-slate-300/80 py-8">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                                        Sign In
                                    </p>
                                    <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                                        Zaloguj się kontem firmowym
                                    </h2>
                                    <p className="max-w-md text-sm leading-7 text-slate-600">
                                        Uwierzytelnianie i zarządzanie kontami odbywa się przez `Auth0`.
                                        Po zalogowaniu przejdziesz do widoków dostępnych dla Twojej roli.
                                    </p>
                                </div>

                                <a href="/auth/login" className="block">
                                    <Button className="h-13 w-full justify-between rounded-none border border-slate-950 bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800">
                                        Przejdź do logowania
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </a>

                                <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
                                    <div className="border-t border-slate-300 pt-3">Single Sign-On</div>
                                    <div className="border-t border-slate-300 pt-3">Role-based access</div>
                                    <div className="border-t border-slate-300 pt-3">Audit-ready history</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
