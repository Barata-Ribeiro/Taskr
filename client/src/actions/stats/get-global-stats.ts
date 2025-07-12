"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { GlobalStats } from "@/@types/stats"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { globalStatsUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

export default async function getGlobalStats() {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = globalStatsUrl()
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: ["global-stats"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<GlobalStats> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
