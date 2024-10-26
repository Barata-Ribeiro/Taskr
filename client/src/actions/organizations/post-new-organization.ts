"use server"

import ResponseError from "@/actions/response-error"
import { ApiResponse, ProblemDetails, State } from "@/interfaces/actions"
import { Organization } from "@/interfaces/organization"
import { ORGANIZATIONS_POST_NEW } from "@/utils/api-urls"
import { auth } from "auth"
import { z } from "zod"

const newOrgSchema = z.object({
    name: z
        .string({ message: "Organization name is required" })
        .trim()
        .min(3, "Organization name must be at least 3 characters")
        .max(50, "Organization name must be at most 50 characters")
        .regex(
            /^[a-zA-Z0-9\s.-]*$/,
            "Organization name can only contain letters, numbers, spaces, periods, and hyphens",
        ),
    description: z
        .string({ message: "Description is required" })
        .trim()
        .min(20, "Description must be at least 20 characters"),
})

export default async function postNewOrganization(state: State, formData: FormData) {
    const session = await auth()

    try {
        const URL = ORGANIZATIONS_POST_NEW()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = newOrgSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await fetch(URL, {
            method: "POST",
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

        const registerResponse = responseData.data as Organization

        return {
            ok: true,
            error: null,
            response: { ...responseData, registerResponse },
        }
    } catch (error) {
        return ResponseError(error)
    }
}
