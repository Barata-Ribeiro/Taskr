"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { Account } from "@/@types/user"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { userAccountUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

export default async function getUserAccount() {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = userAccountUrl()
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: [`user-account-${session.user?.username}`] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<Account> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
