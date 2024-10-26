"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, Paginated, ProblemDetails } from "@/interfaces/actions"
import { Organization } from "@/interfaces/organization"
import { ORGANIZATIONS_GET_LIST } from "@/utils/api-urls"
import { auth } from "auth"

interface GetAllOrganizationsPaginated {
    page: number
    perPage: number
    search: string | null
    direction: string
    orderBy: string
}

export default async function getAllOrganizationsPaginated({
    page,
    perPage,
    search,
    direction,
    orderBy,
}: GetAllOrganizationsPaginated) {
    const session = await auth()

    try {
        const URL = ORGANIZATIONS_GET_LIST(page, perPage, search, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 5, tags: ["organizations"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as Paginated<Organization>

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
