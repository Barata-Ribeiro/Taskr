"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { User } from "@/@types/user"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { adminToggleUserVerificationUrl } from "@/helpers/backend-routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function adminToggleUserVerification(username: string) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = adminToggleUserVerificationUrl(username)

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const tags = [
            "global-stats",
            "user-stats-global",
            "admin-users",
            `profile-${username}`,
            `user-account-${username}`,
        ]
        tags.forEach(tag => revalidateTag(tag))

        return { ok: true, error: null, response: json as RestResponse<User> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
