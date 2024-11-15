"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, Paginated, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { NOTIFICATIONS_GET_ALL_PAGINATED } from "@/utils/api-urls"
import { auth } from "auth"

interface GetAllNotificationsPaginated {
    page: number
    perPage: number
    direction: string
    orderBy: string
}

export default async function getAllNotificationsPaginated({
    page,
    perPage,
    direction,
    orderBy,
}: GetAllNotificationsPaginated) {
    const session = await auth()

    try {
        const URL = NOTIFICATIONS_GET_ALL_PAGINATED(page, perPage, direction, orderBy)

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

        const data = responseData.data as Paginated<Notification>

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
