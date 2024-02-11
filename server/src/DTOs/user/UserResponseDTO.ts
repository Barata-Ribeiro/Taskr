import { UserRole } from "../../entities/user/RoleEnum"
import { User } from "../../entities/user/User"

export class UserResponseDTO {
    id: string
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

        dto.id = user.id
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
