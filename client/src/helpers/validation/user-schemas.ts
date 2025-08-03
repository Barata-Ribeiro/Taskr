import * as z from "zod/v4"

const passwordUpdateSchema = z
    .object({
        currentPassword: z.string("Current password is required"),
        newPassword: z
            .string()
            .trim()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be at most 100 characters")
            .regex(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%¨^&*()\-_=+])(?=\S+$).{8,}$/,
                "Password must contain at least one digit, one lowercase letter, " +
                    "one uppercase letter, one special character and no whitespace.",
            ),
        confirmPassword: z.string({ error: "Password confirmation is required" }).trim(),
    })
    .check(ctx => {
        const { newPassword, confirmPassword } = ctx.value
        if (newPassword !== confirmPassword) {
            ctx.issues.push({
                code: "custom",
                error: "Passwords do not match",
                path: ["confirmPassword"],
                input: "confirmPassword",
            })
        }
    })

const avatarUpdateSchema = z.object({
    avatarUrl: z
        .url({
            protocol: /^https$/,
            hostname: z.regexes.domain,
        })
        .trim()
        .regex(
            /^(https?:\/\/.*\.(jpg|jpeg|png|gif)(\?.*)?(#.*)?$)/i,
            "Url must be a valid image URL ending with jpg, jpeg, png, or gif.",
        ),
})

export { passwordUpdateSchema, avatarUpdateSchema }
