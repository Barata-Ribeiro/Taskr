import decodeToken from "@/utils/decode-token"
import verifyToken from "@/utils/verify-token"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value
    const { pathname } = req.nextUrl
    const clonedUrl = req.nextUrl.clone()
    const isAuthenticated = accessToken ? await verifyToken(accessToken) : false

    if (!isAuthenticated && (clonedUrl.pathname === "/" || pathname.startsWith("/dashboard"))) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    if (isAuthenticated && (clonedUrl.pathname === "/" || pathname.startsWith("/auth"))) {
        const jwtPayload = await decodeToken(accessToken)
        return NextResponse.redirect(new URL("/dashboard/" + jwtPayload, req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/dashboard/:path*",
        "/auth/:path*",
    ],
}
