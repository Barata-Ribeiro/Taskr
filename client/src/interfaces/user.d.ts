type UserRoles = "NONE" | "SERVICE_ADMIN" | "SERVICE_USER" | "BANNED"

interface User {
    id: string
    username: string
    displayName: string
    fullName: string
    email: string
    role: UserRoles
    managedProjects: number
    totalNotifications: number
    totalReadNotifications: number
    totalUnreadNotifications: number
    createdAt: string
    updatedAt: string
}

interface Profile {
    id: string
    username: string
    displayName: string
    fullName: string
    email: string
    role: UserRoles
    createdAt: string
    updatedAt: string
}

export type { UserRoles, User, Profile }
