"use server"

import "server-only"
import env from "@/helpers/env"
import { cookies } from "next/headers"

export default async function createCookie(token: string | undefined, exp: string | undefined) {
    if (!token || !exp) throw new Error("Token or expiration date not found.")

    const cookieStore = await cookies()

    const tokenName = env.AUTH_TOKEN_NAME
    if (!tokenName) throw new Error("Token not found in cookie store.")

    cookieStore.set(tokenName, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: new Date(exp),
    })
}
