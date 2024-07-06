"use server"

import { ApiResponse } from "@/interfaces/actions"
import { User } from "@/interfaces/user"
import { USER_GET_CONTEXT } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { cookies } from "next/headers"

export default async function getUserContext() {
    const URL = USER_GET_CONTEXT()

    try {
        const auth_token = cookies().get("auth_token")?.value
        if (!auth_token) {
            return { ok: false, clientError: null, response: null }
        }

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth_token,
            },
            next: { tags: ["context"] },
            cache: "no-store",
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) {
            return ResponseError(responseData.message)
        }

        const userResponse = responseData.data as User

        return {
            ok: true,
            clientError: null,
            response: { ...responseData, userResponse },
        }
    } catch (error: unknown) {
        console.error("Error: ", error)
        return ResponseError(error)
    }
}
