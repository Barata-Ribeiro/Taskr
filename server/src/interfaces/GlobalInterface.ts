import { User } from "../entities/user/User"

declare global {
    namespace Express {
        export interface Request {
            user: Partial<User> | null
            user_role: string
            is_admin: boolean
            is_moderator: boolean
        }
    }
    namespace JwtPayload {
        export interface JwtPayload {
            _id: string
        }
    }
}
