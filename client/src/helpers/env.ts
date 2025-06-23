import { z } from "zod"

const envSchema = z.object({
    BACKEND_ORIGIN: z.string().min(1).url(),
    AUTH_TOKEN_NAME: z.string().min(1),
})

const env = envSchema.parse({
    BACKEND_ORIGIN: process.env.NEXT_PUBLIC_BACKEND_ORIGIN,
    AUTH_TOKEN_NAME: process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME,
})

export default env
