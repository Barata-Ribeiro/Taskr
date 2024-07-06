import ResponseError from "@/utils/response-error"
import { cookies } from "next/headers"

export default async function verifyAuthentication() {
    const auth_token = cookies().get("auth_token")?.value
    if (!auth_token) return ResponseError("You are not authenticated. Please sign in.")

    return auth_token
}
