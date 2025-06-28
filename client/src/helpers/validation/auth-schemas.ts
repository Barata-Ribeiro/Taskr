import * as z from "zod/v4"

const authLoginSchema = z.object({
    usernameOrEmail: z
        .string({ message: "Username or Email is required" })
        .min(3, "Username or Email must be at least 3 characters"),
    password: z.string({ message: "Password is required" }).min(8, "Password must be at least 8 characters"),
    rememberMe: z.preprocess(val => val === "on", z.boolean().optional()),
})
const registrationSchema = z
    .object({
        username: z
            .string({ message: "Username is required" })
            .min(3, "Username must be between 3 and 50 characters.")
            .max(50, "Username must be between 3 and 50 characters.")
            .regex(/^[a-z]*$/, "Username must contain only lowercase letters."),
        email: z.email({
            pattern: z.regexes.rfc5322Email,
            error: "You must provide a valid email address.",
        }),
        displayName: z
            .string({ message: "Display name is required" })
            .min(3, "Display name must be between 3 and 50 characters.")
            .max(50, "Display name must be between 3 and 50 characters.")
            .regex(/^[a-zA-Z ]*$/, "Display name must contain only letters, and spaces."),
        password: z
            .string({ message: "Password is required" })
            .min(8, "Password must be between 8 and 100 characters.")
            .max(100, "Password must be between 8 and 100 characters.")
            .regex(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%¨^&*()\-_=+])(?=\S+$).{8,}$/,
                "Password must contain at least one digit, one lowercase letter, " +
                    "one uppercase letter, one special character and no whitespace.",
            ),
        confirmPassword: z.string({ message: "Password confirmation is required" }).trim(),
    })
    .check(ctx => {
        const { password, confirmPassword } = ctx.value
        if (confirmPassword !== password)
            ctx.issues.push({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmPassword"],
                input: "confirmPassword",
            })
    })

export { authLoginSchema, registrationSchema }
