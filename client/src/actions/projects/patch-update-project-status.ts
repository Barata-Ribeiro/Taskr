"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { ProjectStatusResponse } from "@/interfaces/project"
import { PROJECTS_PATCH_UPDATE_PROJECT_STATUS } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const projectStatusSchema = z.object({
    organizationId: z.string(),
    projectId: z.string(),
    status: z.string().regex(/^(AWAITING_APPROVAL|ACTIVE|INACTIVE|COMPLETED)$/, "Invalid project status."),
})

export default async function patchUpdateProjectStatus(state: State, formData: FormData) {
    const session = await auth()

    try {
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = projectStatusSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = PROJECTS_PATCH_UPDATE_PROJECT_STATUS(
            +parsedFormData.data.organizationId,
            parsedFormData.data.projectId,
            parsedFormData.data.status,
        )

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            body: JSON.stringify({}),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const registerResponse = responseData.data as ProjectStatusResponse

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
