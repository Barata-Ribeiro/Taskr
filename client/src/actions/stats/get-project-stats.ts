"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { ProjectStats } from "@/@types/stats"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { projectStatsUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

export default async function getProjectStats(projectId: number) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = projectStatsUrl(projectId)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: [`project-stats-${projectId}`, "project-stats-global"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<ProjectStats> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
