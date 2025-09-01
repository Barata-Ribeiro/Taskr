"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { User } from "@/@types/user"
import { auth } from "auth"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { adminAllUsernamesUrl } from "@/helpers/backend-routes"

export default async function adminSearchUsers(term: string) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = adminAllUsernamesUrl(term)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return {
            ok: true,
            error: null,
            response: json as RestResponse<Array<Pick<User, "id" | "username" | "createdAt">>>,
        }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
