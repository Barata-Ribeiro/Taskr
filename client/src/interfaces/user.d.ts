interface User {
    id: string
    username: string
    displayName: string
    fullName: string
    email: string
    role: "NONE" | "SERVICE_ADMIN" | "SERVICE_USER" | "BANNED"
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
    role: "NONE" | "SERVICE_ADMIN" | "SERVICE_USER" | "BANNED"
    createdAt: string
    updatedAt: string
}

export type { User, Profile }
