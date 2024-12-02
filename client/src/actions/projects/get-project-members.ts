"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { ProjectMembersResponse } from "@/interfaces/project"
import { PROJECTS_GET_PROJECT_MEMBERS_BY_ORG_ID_AND_PROJECT_ID } from "@/utils/api-urls"
import { auth } from "auth"

interface GetProjectMembers {
    orgId: string
    projectId: string
}

export default async function getProjectMembers({ orgId, projectId }: GetProjectMembers) {
    const session = await auth()

    try {
        const URL = PROJECTS_GET_PROJECT_MEMBERS_BY_ORG_ID_AND_PROJECT_ID(+orgId, +projectId, true)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 10, tags: ["project-members"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as ProjectMembersResponse

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
