"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { NOTIFICATIONS_PATCH_MARK_AS_READ } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

interface PatchMarkNotifAsRead {
    id: number
}

export default async function patchMarkNotifAsRead({ id }: PatchMarkNotifAsRead) {
    const session = await auth()

    try {
        const URL = NOTIFICATIONS_PATCH_MARK_AS_READ(id.toString())

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            body: JSON.stringify({}),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const registerResponse = responseData.data as Notification

        revalidateTag("context")
        revalidateTag("notifications")
        revalidateTag("notification")

        return {
            ok: true,
            error: null,
            response: { ...responseData, registerResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
