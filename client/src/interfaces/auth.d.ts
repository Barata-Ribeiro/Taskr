import { User } from "@/interfaces/user"

export interface LoginResponse {
    user: User
    token: string
    tokenExpiresAt: string
}
