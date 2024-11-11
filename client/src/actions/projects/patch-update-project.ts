"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { Project } from "@/interfaces/project"
import { PROJECTS_PATCH_UPDATE_PROJECT } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const newProjectSchema = z.object({
    organizationId: z.string(),
    projectId: z.string(),
    name: z
        .string({ message: "Project name is required" })
        .trim()
        .min(3, "Project name must be at least 3 characters")
        .max(50, "Project name must be at most 50 characters")
        .regex(/^[a-zA-Z0-9\s.-]*$/, "Project name can only contain letters, numbers, spaces, periods, and hyphens"),
    description: z
        .string({ message: "Description is required" })
        .trim()
        .min(20, "Description must be at least 20 characters"),
    deadline: z.string({ message: "Deadline is required" }).date(),
})

export default async function patchUpdateProject(state: State, formData: FormData) {
    const session = await auth()

    try {
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = newProjectSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = PROJECTS_PATCH_UPDATE_PROJECT(parsedFormData.data.organizationId, parsedFormData.data.projectId)

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

        const registerResponse = responseData.data as Project

        revalidateTag("organizations")
        revalidateTag("organization")
        revalidateTag("projects")
        revalidateTag("project")

        return {
            ok: true,
            error: null,
            response: { ...responseData, registerResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
