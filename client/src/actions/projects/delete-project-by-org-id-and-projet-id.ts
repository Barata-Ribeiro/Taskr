"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { PROJECTS_DELETE_PROJECT_BY_ORG_ID_AND_PROJECT_ID } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

interface DeleteProjectByOrgIdAndProjetId {
    orgId: number
    projectId: string
}

export default async function deleteProjectByOrgIdAndProjetId({ orgId, projectId }: DeleteProjectByOrgIdAndProjetId) {
    const session = await auth()

    try {
        const URL = PROJECTS_DELETE_PROJECT_BY_ORG_ID_AND_PROJECT_ID(orgId, projectId)
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        revalidateTag("context")
        revalidateTag("organizations")
        revalidateTag("organization")
        revalidateTag("projects")
        revalidateTag("project")

        return {
            ok: true,
            error: null,
            response: responseData,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
