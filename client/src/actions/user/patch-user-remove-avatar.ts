"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails } from "@/interfaces/actions"
import { UserContext } from "@/interfaces/user"
import { USER_PATCH_UPDATE_ACCOUNT } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function patchUserRemoveAvatar() {
    try {
        const session = await auth()
        if (!session) return ResponseError("You must be logged in to perform this action.")

        const URL = USER_PATCH_UPDATE_ACCOUNT(session.user.id, true)

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

        const registerResponse = responseData.data as UserContext

        revalidateTag("context")

        return {
            ok: true,
            error: null,
            response: { ...responseData, registerResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
