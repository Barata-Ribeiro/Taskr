"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { OrganizationProjects } from "@/interfaces/project"
import { PROJECTS_GET_OWN_PROJECTS_BY_ORG_ID } from "@/utils/api-urls"
import { auth } from "auth"

interface GetUserProjectsByOrgId {
    id: number
}

export default async function getUserProjectsByOrgId({ id }: GetUserProjectsByOrgId) {
    const session = await auth()

    try {
        const URL = PROJECTS_GET_OWN_PROJECTS_BY_ORG_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 120 },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as OrganizationProjects

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
