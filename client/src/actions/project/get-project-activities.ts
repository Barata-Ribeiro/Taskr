"use server"

import { Activity } from "@/@types/activity"
import { Paginated, ProblemDetails, QueryParams, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { projectActivitiesUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

interface GetProjectActivities {
    projectId: number
    queryParams: QueryParams
}

export default async function getProjectActivities({ projectId, queryParams }: GetProjectActivities) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = projectActivitiesUrl(projectId, queryParams)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: [`project-activities-${projectId}`] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<Paginated<Activity>> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
