import { UserRole } from "../entities/RoleEnum"
import { User } from "../entities/User"

export class UserResponseDTO {
    _id: string
    firstName?: string
    lastName?: string
    username: string
    email: string
    avatarUrl?: string
    role: UserRole
    createdAt: Date
    updatedAt: Date

    static fromEntity(user: User): UserResponseDTO {
        const dto = new UserResponseDTO()

        dto._id = user._id.toHexString()
        dto.firstName = user.firstName ?? undefined
        dto.lastName = user.lastName ?? undefined
        dto.username = user.username
        dto.email = user.email
        dto.avatarUrl = user.avatarUrl ?? undefined
        dto.role = user.role
        dto.createdAt = user.createdAt
        dto.updatedAt = user.updatedAt

        return dto
    }
}
