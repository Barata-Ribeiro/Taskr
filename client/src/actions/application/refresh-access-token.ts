import { RestResponse } from "@/@types/application"
import { LoginResponse } from "@/@types/authentication"
import { refreshTokenAuthUrl } from "@/helpers/backend-routes"
import getTokenAndExpiration from "@/helpers/get-token-and-expiration"
import { JWT } from "next-auth/jwt"

export default async function refreshAccessToken(token: JWT) {
    const URL = refreshTokenAuthUrl()

    const { token: refreshToken } = await getTokenAndExpiration()
    if (!refreshToken) {
        console.error("No refresh token found.")
        return { ...token, error: "RefreshAccessTokenError" }
    }

    const response = await fetch(URL, {
        method: "GET",
        headers: { "Content-Type": "application/json", "X-Refresh-Token": refreshToken },
    })

    const json = await response.json()

    if (!response.ok) {
        console.error("Refresh token error: ", json)
        return { ...token, error: "RefreshAccessTokenError" }
    }

    const payload = json as RestResponse<LoginResponse>
    if (!payload?.data) {
        console.error("Invalid response from refresh token endpoint: ", payload)
        return { ...token, error: "RefreshAccessTokenError" }
    }

    return { ...payload.data, error: null }
}
