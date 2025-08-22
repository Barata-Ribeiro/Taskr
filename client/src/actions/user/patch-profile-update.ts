"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { UserProfile } from "@/@types/user"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData, unauthenticated } from "@/actions/application/to-problem-details"
import { updateUserAccountUrl } from "@/helpers/backend-routes"
import { profileUpdateSchema } from "@/helpers/validation/user-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function patchProfileUpdate(state: State<unknown>, formData: unknown) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = profileUpdateSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const URL = updateUserAccountUrl()

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
