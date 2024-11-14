"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { UserContext } from "@/interfaces/user"
import { USER_PATCH_UPDATE_ACCOUNT } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const updateAvatarSchema = z.object({
    avatarUrl: z.string({ message: "Avatar URL is required" }).url({ message: "This field requires a valid URL" }),
    currentPassword: z.string({ message: "Current password is required" }),
})

export default async function patchUserUpdateAvatar(state: State, formData: FormData) {
    const session = await auth()
    if (!session)
        return {
            ok: false,
            error: {
                type: "https://httpstatuses.com/401",
                title: "Not Authenticated",
                status: 401,
                detail: "User is not authenticated.",
                instance: "_Blank",
            },
            response: null,
        }

    try {
        const URL = USER_PATCH_UPDATE_ACCOUNT(session?.user.id)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = updateAvatarSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session?.accessToken,
            },
            body: JSON.stringify(parsedFormData.data),
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
