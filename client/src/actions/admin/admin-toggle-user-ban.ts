"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { UserProfile } from "@/@types/user"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { adminToggleUserBanUrl } from "@/helpers/backend-routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function adminToggleUserBan(username: string) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = adminToggleUserBanUrl(username)

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

        return { ok: true, error: null, response: json as RestResponse<UserProfile> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
