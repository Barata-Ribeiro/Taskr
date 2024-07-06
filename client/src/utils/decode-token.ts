import { jwtDecrypt } from "jose"

export default async function decodeToken(token: string) {
    if (!token) throw new Error("No token provided.")
    if (token.length < 10) throw new Error("Token is invalid.")

    try {
        const secret_key = new TextEncoder().encode(process.env.JWT_BACKEND_SECRET)

        const { payload } = await jwtDecrypt(token, secret_key)

        return payload
    } catch (error) {
        console.error(error)
        throw new Error("Something went wrong. Please try again.")
    }
}
