"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { LatestNotifications } from "@/@types/notification"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { latestNotificationUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

export default async function getLatestNotifications() {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = latestNotificationUrl()
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: [`notifications-${session.user?.username}`] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<LatestNotifications> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
