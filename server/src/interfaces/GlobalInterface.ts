import { User } from "../entities/user/User"

declare global {
    namespace Express {
        export interface Request {
            user: {
                data: Partial<User> | null
                is_admin: boolean
                is_moderator: boolean
                is_in_team: boolean
            }
        }
    }
    namespace JwtPayload {
        export interface JwtPayload {
            id: string
        }
    }
}
