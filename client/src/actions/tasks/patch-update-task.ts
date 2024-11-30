"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { Task } from "@/interfaces/task"
import { TASKS_PATCH_UPDATE_TASK_BY_PROJECT_ID_AND_TASK_ID } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const updateTaskSchema = z
    .object({
        projectId: z.string(),
        taskId: z.string(),
        title: z
            .string({ message: "Task title is required" })
            .trim()
            .min(3, "Task title must be at least 3 characters")
            .max(50, "Task title must be at most 50 characters")
            .regex(/^[a-zA-Z0-9\s.-]*$/, "Task title can only contain letters, numbers, spaces, periods, and hyphens")
            .nullish()
            .or(z.literal("")),
        description: z
            .string({ message: "Description is required" })
            .trim()
            .min(20, "Description must be at least 20 characters")
            .nullish()
            .or(z.literal("")),
        status: z.enum(["OPEN", "IN_PROGRESS", "IN_REVIEW", "DONE"]).nullish().or(z.literal("")),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).nullish().or(z.literal("")),
        startDate: z.string({ message: "Deadline is required" }).date().nullish().or(z.literal("")),
        dueDate: z.string({ message: "Deadline is required" }).date().nullish().or(z.literal("")),
    })
    .superRefine(({ startDate, dueDate }, ctx) => {
        if (startDate && dueDate && startDate > dueDate) {
            ctx.addIssue({
                code: "custom",
                message: "Start date must be before the due date",
                path: ["startDate", "dueDate"],
            })
        }
    })
    .transform(data => {
        if (data.title === "") delete data.title
        if (data.description === "") delete data.description
        if (data.status === "") delete data.status
        if (data.priority === "") delete data.priority
        if (data.startDate === "") delete data.startDate
        if (data.dueDate === "") delete data.dueDate
        return data
    })

export default async function patchUpdateTask(state: State, formData: FormData) {
    const session = await auth()

    try {
        const rawFormData = Object.fromEntries(formData.entries())

        const parsedFormData = updateTaskSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = TASKS_PATCH_UPDATE_TASK_BY_PROJECT_ID_AND_TASK_ID(
            +parsedFormData.data.projectId,
            +parsedFormData.data.taskId,
        )

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const registerResponse = responseData.data as Task

        revalidateTag("project")
        revalidateTag("projects")
        revalidateTag("task")
        revalidateTag("tasks")

        return {
            ok: true,
            error: null,
            response: { ...responseData, registerResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
