"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { AUTH_LOGOUT } from "@/utils/api-urls"
import { signOut } from "auth"
import { cookies } from "next/headers"

export default async function deleteAuthLogout() {
    try {
        const URL = AUTH_LOGOUT()

        const refreshToken = cookies().get("auth_rt")?.value
        if (!refreshToken) return ResponseError("No refresh token found.")

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Refresh-Token": refreshToken,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        await signOut()

        const responseData = json as ApiResponse

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        console.log("CALLBACK ERROR: ", error)
        return ResponseError(error)
    }
}
