"use server"

import { ApiResponse, State } from "@/interfaces/actions"
import { User } from "@/interfaces/user"
import { AUTH_REGISTER } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"

export default async function signUp(state: State, formData: FormData) {
    const URL = AUTH_REGISTER()

    try {
        const username = formData.get("username") as string | null
        const displayName = formData.get("displayName") as string | null
        const email = formData.get("email") as string | null
        const password = formData.get("password") as string | null

        if (!username || !displayName || !email || !password) {
            return ResponseError("All fields are required.")
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, displayName, email, password }),
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) {
            return ResponseError(responseData.message)
        }

        const registerResponse = responseData.data as User

        return {
            ok: true,
            clientError: null,
            response: { ...responseData, registerResponse },
        }
    } catch (error: unknown) {
        console.error("Error: ", error)
        return ResponseError(error)
    }
}
