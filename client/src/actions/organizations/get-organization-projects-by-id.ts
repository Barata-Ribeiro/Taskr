"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { OrganizationProjectsList } from "@/interfaces/organization"
import { ORGANIZATIONS_GET_PROJECTS_BY_ID } from "@/utils/api-urls"
import { auth } from "auth"

interface GetOrganizationProjectsById {
    id: string
}

export default async function getOrganizationProjectsById({ id }: GetOrganizationProjectsById) {
    const session = await auth()

    try {
        const URL = ORGANIZATIONS_GET_PROJECTS_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 60, tags: ["organization", "projects"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as OrganizationProjectsList

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
