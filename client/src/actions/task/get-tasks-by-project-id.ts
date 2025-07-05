"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { TasksByStatus } from "@/@types/task"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { auth } from "@/auth"
import { tasksByProjectUrl } from "@/helpers/backend-routes"

export default async function getTasksByProjectId(id: number) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = tasksByProjectUrl(id)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: [`tasks-project-${id}`] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<TasksByStatus> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
