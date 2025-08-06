"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { Comment } from "@/@types/comment"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData, unauthenticated } from "@/actions/application/to-problem-details"
import { updateCommentUrl } from "@/helpers/backend-routes"
import { updateCommentSchema } from "@/helpers/validation/comment-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function patchOwnComment(state: State<unknown>, formData: unknown) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = updateCommentSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const projectId = parsedFormData.data.projectId
        const taskId = parsedFormData.data.taskId
        const commentId = parsedFormData.data.commentId

        const URL = updateCommentUrl(commentId, taskId)

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

        revalidateTag(`task-${taskId}-comments`)
        revalidateTag(`project-activities-${projectId}`)

        return { ok: true, error: null, response: json as RestResponse<Comment> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
