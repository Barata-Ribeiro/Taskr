"use server"

import { Paginated, ProblemDetails, QueryParams, RestResponse } from "@/@types/application"
import { User } from "@/@types/user"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { adminAllUsersUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

export default async function adminGetAllUsersPaginated(queryParams: QueryParams) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = adminAllUsersUrl(queryParams)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: ["admin-users"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<Paginated<User>> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
