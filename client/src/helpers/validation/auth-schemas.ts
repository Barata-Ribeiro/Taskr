import * as z from "zod/v4"

const authLoginSchema = z.object({
    usernameOrEmail: z
        .string({ message: "Username or Email is required" })
        .min(3, "Username or Email must be at least 3 characters"),
    password: z.string({ message: "Password is required" }).min(8, "Password must be at least 8 characters"),
    rememberMe: z.preprocess(val => val === "on", z.boolean().optional()),
})

export { authLoginSchema }
