"use server"

import ResponseError from "@/actions/response-error"
import { auth } from "@/auth"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { NOTIFICATIONS_DELETE_BY_ID } from "@/utils/api-urls"
import { revalidateTag } from "next/cache"

interface DeleteNotificationById {
    id: number
}

export default async function deleteNotificationById({ id }: DeleteNotificationById) {
    const session = await auth()

    try {
        const URL = NOTIFICATIONS_DELETE_BY_ID(id.toString())

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

        revalidateTag("context")
        revalidateTag("notifications")
        revalidateTag("notification")

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
