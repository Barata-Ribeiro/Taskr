import env from "@/helpers/env"
import { cookies } from "next/headers"

export default async function getTokenAndExpiration() {
    const cookieStore = await cookies()

    const tokenName = env.AUTH_TOKEN_NAME
    if (!tokenName) throw new Error("Token name not found in environment variables.")

    const token = cookieStore.get(tokenName)?.value
    if (!token) throw new Error("Token not found in cookie store.")

    const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())

    return { token: token, expiresAt: decodedToken["exp"] * 1000 }
}
