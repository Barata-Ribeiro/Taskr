import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { LoginResponse } from "@/interfaces/auth"
import { AUTH_REFRESH_TOKEN } from "@/utils/api-urls"
import verifyToken from "@/utils/verify-token"
import { cookies } from "next/headers"

export default async function verifyAuthentication() {
    let accessToken = cookies().get("access_token")?.value
    const refreshToken = cookies().get("refresh_token")?.value

    if (!refreshToken) {
        throw {
            type: "https://tools.ietf.org/html/rfc7235#section-4.1",
            title: "Authentication Error",
            status: 401,
            detail: "You are not authorized to access this resource.",
            instance: "https://tools.ietf.org/html/rfc7235#section-4.1",
        }
    }

    if (!accessToken || !(await verifyToken(accessToken))) {
        const URL = AUTH_REFRESH_TOKEN()
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
            throw json as ProblemDetails
        }

        const responseData = json as ApiResponse

        const data = responseData.data as LoginResponse

        cookies().set("access_token", data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: new Date(data.accessTokenExpiresAt),
        })

        accessToken = data.accessToken
    }

    return accessToken
}
