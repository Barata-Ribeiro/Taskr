"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { UserContext } from "@/interfaces/user"
import { USER_GET_CONTEXT } from "@/utils/api-urls"
import { auth } from "auth"

export default async function getUserContext() {
    try {
        const session = await auth()
        const URL = USER_GET_CONTEXT()

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            next: { revalidate: 5, tags: ["context"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const responseData = json as ApiResponse

        const data = responseData.data as UserContext

        return {
            ok: true,
            error: null,
            response: { ...responseData, data },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
