"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { MoveRequest, TasksByStatus } from "@/@types/task"
import ResponseError from "@/actions/application/response-error"
import { invalidData, unauthenticated } from "@/actions/application/to-problem-details"
import { moveTaskUrl } from "@/helpers/backend-routes"
import { moveTaskSchema } from "@/helpers/validation/task-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function moveTask(taskId: number, data: MoveRequest) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!taskId || taskId <= 0) return ResponseError(invalidData)

        const URL = moveTaskUrl(taskId)

        const parsedData = moveTaskSchema.safeParse(data)
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

        const projectId = parsedData.data.projectId

        const tags = [
            `tasks-project-${projectId}`,
            `project-${projectId}`,
            `project-activities-${projectId}`,
            `my-projects-${session.user?.username}`,
        ]

        tags.forEach(revalidateTag)

        return { ok: true, error: null, response: json as RestResponse<TasksByStatus> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
