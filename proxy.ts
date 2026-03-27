import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth0 } from "./lib/auth0";

const PUBLIC_PATHS = ["/"]
const PROTECTED_PATHS = ["/dashboard", "/policy"]

export async function proxy(request: NextRequest) {
    const authResponse = await auth0.middleware(request);

    return authResponse;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
