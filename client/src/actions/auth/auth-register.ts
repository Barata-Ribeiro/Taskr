"use server"

import "server-only"
import { ProblemDetails, State } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData } from "@/actions/application/to-problem-details"
import { registerAuthUrl } from "@/helpers/backend-routes"
import { registrationSchema } from "@/helpers/validation/auth-schemas"
import { redirect } from "next/navigation"

export async function authRegister(state: State<null>, formData: unknown) {
    try {
        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = registrationSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const URL = registerAuthUrl()

        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }
    } catch (e: unknown) {
        return ResponseError(e)
    }

    redirect("/auth/login")
}
