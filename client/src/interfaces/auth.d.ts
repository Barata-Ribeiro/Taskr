import { User } from "@/interfaces/user"

export interface LoginResponse {
    user: User
    accessToken: string
    accessTokenExpiresAt: string
    refreshToken?: string
    refreshTokenExpiresAt?: string
}
