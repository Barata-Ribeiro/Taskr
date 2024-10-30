"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { OrganizationMembersList } from "@/interfaces/organization"
import { ORGANIZATIONS_GET_MEMBERS_BY_ID } from "@/utils/api-urls"
import { auth } from "auth"

interface GetOrganizationMembersById {
    id: string
    page: number
    perPage: number
    search: string | null
    direction: string
    orderBy: string
}

export default async function getOrganizationMembersById({
    id,
    page,
    perPage,
    search,
    direction,
    orderBy,
}: GetOrganizationMembersById) {
    const session = await auth()

    try {
        const URL = ORGANIZATIONS_GET_MEMBERS_BY_ID(id, page, perPage, search, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 60, tags: ["organization", "members"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as OrganizationMembersList

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
