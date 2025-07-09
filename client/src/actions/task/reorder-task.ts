"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { ReorderRequest, TasksByStatus } from "@/@types/task"
import ResponseError from "@/actions/application/response-error"
import { invalidData, unauthenticated } from "@/actions/application/to-problem-details"
import { reorderTasksUrl } from "@/helpers/backend-routes"
import { reorderTasksSchema } from "@/helpers/validation/task-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function reorderTask(projectId: number, data: ReorderRequest) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!projectId || projectId <= 0) return ResponseError(invalidData)

        const URL = reorderTasksUrl(projectId)

        const parsedData = reorderTasksSchema.safeParse(data)
        if (!parsedData.success) return ResponseError(parsedData.error)

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(parsedData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        revalidateTag(`tasks-project-${projectId}`)
        revalidateTag(`project-${projectId}`)
        revalidateTag(`my-projects-${session.user?.username}`)

        return { ok: true, error: null, response: json as RestResponse<TasksByStatus> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
