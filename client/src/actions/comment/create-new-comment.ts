"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { Comment } from "@/@types/comment"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData, unauthenticated } from "@/actions/application/to-problem-details"
import { createCommentUrl } from "@/helpers/backend-routes"
import { createCommentSchema } from "@/helpers/validation/comment-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function createNewComment(state: State<unknown>, formData: unknown) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = createCommentSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const taskId = parsedFormData.data.taskId
        const projectId = parsedFormData.data.projectId

        const URL = createCommentUrl(taskId)

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

        revalidateTag("global-stats")
        revalidateTag(`user-account-${session.user?.username}`)
        revalidateTag(`task-${taskId}`)
        revalidateTag(`task-${taskId}-comments`)
        revalidateTag(`tasks-project-${projectId}`)
        revalidateTag(`project-stats-${projectId}`)

        return { ok: true, error: null, response: json as RestResponse<Comment> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
