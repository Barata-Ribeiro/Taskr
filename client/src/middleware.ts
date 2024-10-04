import decodeToken from "@/utils/decode-token"
import verifyToken from "@/utils/verify-token"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const auth_token = req.cookies.get("auth_token")?.value
    const authenticated = auth_token ? await verifyToken(auth_token) : false

    if (!authenticated && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign/in", req.url))
    }

    if (authenticated && req.nextUrl.pathname.startsWith("/sign")) {
        const jwtPayload = await decodeToken(auth_token)
        return NextResponse.redirect(new URL("/dashboard/" + jwtPayload, req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/sign/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
