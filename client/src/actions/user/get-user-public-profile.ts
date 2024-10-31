"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { Profile } from "@/interfaces/user"
import { USER_GET_PUBLIC_PROFILE_BY_ID } from "@/utils/api-urls"
import { auth } from "auth"

interface GetUserPublicProfile {
    id: string
}

export default async function getUserPublicProfile({ id }: GetUserPublicProfile) {
    const session = await auth()

    try {
        const URL = USER_GET_PUBLIC_PROFILE_BY_ID(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 60, tags: ["profile", "context", "dashboard"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as Profile

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
