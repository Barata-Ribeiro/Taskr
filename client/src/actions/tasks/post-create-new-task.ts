"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { Task } from "@/interfaces/task"
import { TASKS_POST_CREATE_NEW_TASK } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const newTaskSchema = z
    .object({
        projectId: z.string(),
        title: z
            .string({ message: "Task title is required" })
            .trim()
            .min(3, "Task title must be at least 3 characters")
            .max(50, "Task title must be at most 50 characters")
            .regex(/^[a-zA-Z0-9\s.-]*$/, "Task title can only contain letters, numbers, spaces, periods, and hyphens"),
        description: z
            .string({ message: "Description is required" })
            .trim()
            .min(20, "Description must be at least 20 characters"),
        status: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        startDate: z.string({ message: "Deadline is required" }).date(),
        dueDate: z.string({ message: "Deadline is required" }).date(),
    })
    .superRefine(({ startDate, dueDate }, ctx) => {
        if (startDate > dueDate) {
            ctx.addIssue({
                code: "custom",
                message: "Start date must be before the due date",
                path: ["startDate", "dueDate"],
            })
        }
    })

export default async function postCreateNewTask(state: State, formData: FormData) {
    const session = await auth()

    try {
        const rawFormData = Object.fromEntries(formData.entries())

        console.log("DATA: ", rawFormData)

        const parsedFormData = newTaskSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = TASKS_POST_CREATE_NEW_TASK(+parsedFormData.data.projectId)

        const response = await fetch(URL, {
            method: "POST",
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
