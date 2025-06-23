import { RestResponse } from "@/@types/application"
import { LoginResponse } from "@/@types/authentication"
import getTokenAndExpiration from "@/helpers/get-token-and-expiration"
import { JWT } from "next-auth/jwt"

export default async function refreshAccessToken(token: JWT) {
    const URL = "" // TODO: TODO: Add function to get the API URL FOR THE REFRESH TOKEN ENDPOINT

    const { token: refreshToken } = await getTokenAndExpiration()
    if (!refreshToken) {
        console.error("No refresh token found.")
        return { ...token, error: "RefreshAccessTokenError" }
    }

    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Refresh-Token": refreshToken,
        },
        body: JSON.stringify({}),
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

    return {
        user: payload.data.user,
        accessToken: payload.data.accessToken,
        accessTokenExpiresAt: payload.data.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        error: null,
    }
}
