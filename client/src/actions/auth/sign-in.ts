"use server"

import { ApiResponse, State } from "@/interfaces/actions"
import { LoginResponse } from "@/interfaces/auth"
import { AUTH_LOGIN } from "@/utils/api-urls"
import ResponseError from "@/utils/response-error"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export default async function signIn(_state: State, formData: FormData) {
    const URL = AUTH_LOGIN()
    const ONE_DAY = 24 * 60 * 60 * 1000
    const ONE_YEAR = 365 * ONE_DAY

    try {
        const username = formData.get("username") as string | null
        const password = formData.get("password") as string | null
        const rememberMe = formData.get("rememberMe") === "on"

        if (!username || !password) {
            return ResponseError("Username and password are required.")
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, rememberMe }),
        })

        const responseData = (await response.json()) as ApiResponse

        if (!response.ok) {
            return ResponseError(responseData.message)
        }

        const loginResponse = responseData.data as LoginResponse

        cookies().set("auth_token", loginResponse.token, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: rememberMe ? ONE_YEAR : ONE_DAY,
        })

        revalidateTag("context")

        return {
            ok: true,
            clientError: null,
            response: { ...responseData, loginResponse },
        }
    } catch (error: unknown) {
        console.error("Error: ", error)
        return ResponseError(error)
    }
}
