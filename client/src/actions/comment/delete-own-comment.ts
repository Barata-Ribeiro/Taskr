"use server"

import { ProblemDetails } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { deleteCommentUrl } from "@/helpers/backend-routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function deleteOwnComment(projectId: number, taskId: number, commentId: number) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = deleteCommentUrl(commentId, taskId)

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
        })

        if (!response.ok) {
            const problemDetails = (await response.json()) as ProblemDetails
            return ResponseError(problemDetails)
        }

        const tags = [
            `task-${taskId}-comments`,
            `task-${taskId}`,
            "global-stats",
            "user-stats-global",
            "project-stats-global",
            `project-activities-${projectId}`,
        ]

        tags.forEach(revalidateTag)

        return { ok: true, error: null, response: null }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
