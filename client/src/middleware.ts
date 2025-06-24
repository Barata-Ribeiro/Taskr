import { auth } from "auth"
import { NextRequest, NextResponse } from "next/server"

export default auth((request: NextRequest) => {
    const headers = new Headers(request.headers)
    headers.set("x-current-path", `${request.nextUrl.protocol}//${request.nextUrl.host}${request.nextUrl.pathname}`)

    return NextResponse.next({ request: { headers } })
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/((?!api|trpc|_next/static|_next/image|favicon.ico).*)",
    ],
}
