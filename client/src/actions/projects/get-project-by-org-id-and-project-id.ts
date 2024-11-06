"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { ProjectResponse } from "@/interfaces/project"
import { PROJECTS_GET_BY_ORG_ID_AND_PROJECT_ID } from "@/utils/api-urls"
import { auth } from "auth"

interface GetProjectByOrgIdAndProjectId {
    orgId: number
    projectId: number
}

export default async function getProjectByOrgIdAndProjectId({ orgId, projectId }: GetProjectByOrgIdAndProjectId) {
    const session = await auth()

    try {
        const URL = PROJECTS_GET_BY_ORG_ID_AND_PROJECT_ID(orgId, projectId)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            cache: "no-cache",
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as ProjectResponse

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
