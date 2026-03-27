import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth0 } from "./lib/auth0";

const PUBLIC_PATHS = ["/"]
const PROTECTED_PATHS = ["/dashboard", "/policy"]

export async function proxy(request: NextRequest) {
    const session = await auth0.getSession(request);
    const { pathname } = request.nextUrl;

    const isAuthenticated = !!session;

    if (isAuthenticated && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

    if (!isAuthenticated && isProtectedPath) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return await auth0.middleware(request);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
