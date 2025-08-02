"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { deleteUserAccountUrl } from "@/helpers/backend-routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function deleteAccount() {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = deleteUserAccountUrl()
        const response = await fetch(URL, {
            method: "DELETE",
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

        revalidateTag("global-stats")
        revalidateTag("user-stats-global")
        revalidateTag("project-stats-global")

        return { ok: true, error: null, response: json as RestResponse<null> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
