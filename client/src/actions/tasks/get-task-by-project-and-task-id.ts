"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { TaskResponse } from "@/interfaces/task"
import { TASKS_GET_BY_PROJECT_ID_AND_TASK_ID } from "@/utils/api-urls"
import { auth } from "auth"

interface GetTaskByProjectAndTaskId {
    projectId: string
    taskId: string
}

export default async function getTaskByProjectAndTaskId({ projectId, taskId }: GetTaskByProjectAndTaskId) {
    const session = await auth()

    try {
        const URL = TASKS_GET_BY_PROJECT_ID_AND_TASK_ID(+projectId, +taskId)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 60, tags: ["task"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as TaskResponse

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
