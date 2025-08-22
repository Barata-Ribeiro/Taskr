"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { UserProfile } from "@/@types/user"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData, unauthenticated } from "@/actions/application/to-problem-details"
import { adminUpdateUserByUsernameUrl } from "@/helpers/backend-routes"
import { adminProfileUpdateSchema } from "@/helpers/validation/admin-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function adminUpdateUserByUsername(state: State<unknown>, formData: unknown) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = adminProfileUpdateSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const currentUsername = parsedFormData.data.currentUsername as string
        const URL = adminUpdateUserByUsernameUrl(currentUsername)

        parsedFormData.data.currentUsername = null

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        const updateResponse = json as RestResponse<UserProfile>

        const tags = [
            "global-stats",
            "user-stats-global",
            "admin-users",
            `profile-${updateResponse.data?.username}`,
            `user-account-${updateResponse.data?.username}`,
        ]
        tags.forEach(tag => revalidateTag(tag))

        return { ok: true, error: null, response: updateResponse }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
