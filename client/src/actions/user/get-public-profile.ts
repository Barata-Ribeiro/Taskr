"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { UserProfile } from "@/@types/user"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { publicUserProfileUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

export default async function getPublicProfile(username: string) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = publicUserProfileUrl(username)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: [`profile-${username}`] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<UserProfile> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
