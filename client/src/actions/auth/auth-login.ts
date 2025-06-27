"use server"

import "server-only"
import { State } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData } from "@/actions/application/to-problem-details"
import { authLoginSchema } from "@/helpers/validation/auth-schemas"
import { signIn } from "auth"

export default async function authLogin(state: State<null>, formData: unknown) {
    try {
        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = authLoginSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        await signIn("credentials", {
            usernameOrEmail: parsedFormData.data.usernameOrEmail,
            password: parsedFormData.data.password,
            rememberMe: parsedFormData.data.rememberMe,
            redirect: false,
        })

        return { ok: true, error: null, response: null }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
