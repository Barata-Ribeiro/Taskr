"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { Comment } from "@/@types/comment"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { adminToggleDeleteCommentUrl } from "@/helpers/backend-routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function adminToggleCommentDelete(taskId: number, commentId: number) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = adminToggleDeleteCommentUrl(commentId)

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        revalidateTag(`task-${taskId}-comments`)

        return { ok: true, error: null, response: json as RestResponse<Comment> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
