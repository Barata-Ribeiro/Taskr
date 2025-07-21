"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { Notification } from "@/@types/notification"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { changeNotificationsStatusInBulkUrl } from "@/helpers/backend-routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function changeNotifStatusBulk(ids: (number | string)[], isRead: boolean) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = changeNotificationsStatusInBulkUrl(isRead)
        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(ids),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        revalidateTag(`notifications-${session.user?.username}`)

        return { ok: true, error: null, response: json as RestResponse<Notification[]> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
