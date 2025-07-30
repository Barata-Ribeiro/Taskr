"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { Task } from "@/@types/task"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData, unauthenticated } from "@/actions/application/to-problem-details"
import { updateTaskUrl } from "@/helpers/backend-routes"
import { taskUpdateSchema } from "@/helpers/validation/task-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function updateTaskById(state: State<unknown>, formData: unknown) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = taskUpdateSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const taskId = parsedFormData.data.taskId
        const projectId = parsedFormData.data.projectId

        const URL = updateTaskUrl(taskId)

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        revalidateTag(`project-activities-${projectId}`)
        revalidateTag(`tasks-project-${projectId}`)
        revalidateTag(`task-${taskId}`)

        return { ok: true, error: null, response: json as RestResponse<Task> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
