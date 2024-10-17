import { auth } from "auth"
import { NextRequest, NextResponse } from "next/server"

export default auth((request: NextRequest) => {
    const { pathname } = request.nextUrl

    if (pathname === "/") {
        return NextResponse.redirect(new URL("/auth/login", request.nextUrl).toString())
    }
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/((?!api|trpc|_next/static|_next/image|favicon.ico).*)",
    ],
}
