"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { notFoundToken } from "@/actions/application/to-problem-details"
import { signOut } from "@/auth"
import { logoutAuthUrl } from "@/helpers/backend-routes"
import getTokenAndExpiration from "@/helpers/get-token-and-expiration"
import { cookies } from "next/headers"

export default async function authLogout() {
    const cookieStore = await cookies()
    const tokenAndExpiration = await getTokenAndExpiration()

    try {
        if (!tokenAndExpiration) return ResponseError(notFoundToken)

        const URL = logoutAuthUrl()

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Refresh-Token": tokenAndExpiration.token,
            },
        })

        await signOut({ redirect: false })

        if (cookieStore) {
            cookieStore.getAll().forEach(cookie => cookieStore.delete(cookie.name))
        }

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<null> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
