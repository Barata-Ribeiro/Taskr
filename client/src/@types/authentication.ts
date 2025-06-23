import { User } from "@/@types/user"

export interface LoginResponse {
    user: User
    accessToken: string
    accessTokenExpiresAt: string
    refreshToken?: string
    refreshTokenExpiresAt?: string
}
