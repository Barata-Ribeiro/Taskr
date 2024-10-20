import { auth } from "auth"
import { NextRequest, NextResponse } from "next/server"

export default auth((request: NextRequest) => {
    // @ts-expect-error `auth` is added to the request object by the `auth` middleware
    const { auth } = request
    const { pathname } = request.nextUrl
    const isAuthenticated = !!auth

    const searchTerm = pathname.split("/").slice(0, 2).join("/")

    if (searchTerm.includes("/dashboard")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(
                new URL(`/auth/login?callbackUrl=${encodeURIComponent(request.nextUrl.href)}`, request.nextUrl),
            )
        }
    }

    if (pathname === "/" || pathname.startsWith("/auth")) {
        if (isAuthenticated && !auth.error) {
            return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
        }
    }
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/((?!api|trpc|_next/static|_next/image|favicon.ico).*)",
    ],
}
