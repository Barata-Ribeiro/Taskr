"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { UserContext } from "@/interfaces/user"
import { USER_PATCH_UPDATE_ACCOUNT } from "@/utils/api-urls"
import { auth } from "auth"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const updateAccountSchema = z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters").nullish().or(z.literal("")),
    lastName: z.string().min(3, "Last name must be at least 3 characters").nullish().or(z.literal("")),
    username: z
        .string({ message: "Username is required" })
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be at most 50 characters")
        .regex(/^[a-z]*$/, "Username must contain only lowercase letters")
        .nullish()
        .or(z.literal("")),
    displayName: z
        .string({ message: "Display Name is required" })
        .trim()
        .min(3, "Display Name must be at least 3" + " characters")
        .max(50, "Display Name must be at most 50 characters")
        .regex(/^[a-zA-Z\s]*$/, "Display Name must contain only letters and spaces")
        .nullish()
        .or(z.literal("")),
    currentPassword: z.string({ message: "Current password is required" }),
})

export default async function patchUserUpdateAccount(state: State, formData: FormData) {
    try {
        const session = await auth()
        if (!session) return ResponseError("You must be logged in to perform this action.")

        const URL = USER_PATCH_UPDATE_ACCOUNT(session?.user.id)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = updateAccountSchema.safeParse(rawFormData)

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
