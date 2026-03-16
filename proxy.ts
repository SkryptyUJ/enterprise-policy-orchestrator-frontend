import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login"]
const PROTECTED_PATHS = ["/dashboard", "/policy"]

export function proxy(request: NextRequest) {
    // const { pathname } = request.nextUrl

    // // TODO: Po instalacji @auth0/nextjs-auth0 zastąp sprawdzanie cookie
    // // rzeczywistą weryfikacją sesji Auth0
    // const isAuthenticated = request.cookies.has("appSession")

    // const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
    // const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

    // // Niezalogowany → chroniona strona: redirect na /login
    // if (!isAuthenticated && isProtectedPath) {
    //     const loginUrl = new URL("/login", request.url)
    //     loginUrl.searchParams.set("returnTo", pathname)
    //     return NextResponse.redirect(loginUrl)
    // }

    // // Zalogowany → /login: redirect na /dashboard
    // if (isAuthenticated && isPublicPath) {
    //     return NextResponse.redirect(new URL("/dashboard", request.url))
    // }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
