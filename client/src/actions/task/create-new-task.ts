"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { Task } from "@/@types/task"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData, unauthenticated } from "@/actions/application/to-problem-details"
import { createTaskUrl } from "@/helpers/backend-routes"
import { taskCreateSchema } from "@/helpers/validation/task-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function createNewTask(state: State<unknown>, formData: unknown) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = taskCreateSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const URL = createTaskUrl()

        const response = await fetch(URL, {
            method: "POST",
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

        const projectId = parsedFormData.data.projectId

        revalidateTag(`tasks-project-${projectId}`)
        revalidateTag(`project-${projectId}`)
        revalidateTag(`project-activities-${projectId}`)
        revalidateTag(`my-projects-${session.user?.username}`)
        revalidateTag(`project-stats-${projectId}`)
        revalidateTag(`profile-${session.user?.username}`)
        revalidateTag(`user-stats-${session.user?.id}`)

        return { ok: true, error: null, response: json as RestResponse<Task> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
