"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { USER_DELETE_ACCOUNT } from "@/utils/api-urls"
import getAuthCookies from "@/utils/get-auth-cookies"
import { auth, signOut } from "auth"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

export default async function deleteUseAccount() {
    const session = await auth()

    if (!session)
        return {
            ok: false,
            error: {
                type: "https://httpstatuses.com/401",
                title: "Not Authenticated",
                status: 401,
                detail: "User is not authenticated.",
                instance: "_Blank",
            },
            response: null,
        }

    try {
        const URL = USER_DELETE_ACCOUNT(session.user.id)
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        await signOut({ redirect: false })

        const cookieStore = await getAuthCookies()
        if (cookieStore) {
            ;(cookieStore as RequestCookie[]).forEach(cookie => cookies().delete(cookie.name))
        }

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
