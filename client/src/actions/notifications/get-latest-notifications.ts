"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { NOTIFICATIONS_GET_LATEST } from "@/utils/api-urls"
import { auth } from "auth"

export default async function getLatestNotifications() {
    const session = await auth()

    try {
        const URL = NOTIFICATIONS_GET_LATEST()

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 5, tags: ["notifications"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as Notification[]

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
