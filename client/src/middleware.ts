export { auth as middleware } from "auth"

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/dashboard/:path*",
        "/auth/:path*",
    ],
}
