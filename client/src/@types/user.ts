enum Roles {
    NONE = "NONE",
    USER = "USER",
    ADMIN = "ADMIN",
    BANNED = "BANNED",
}

interface User {
    id: string
    username: string
    email: string
    role: Roles
    avatarUrl: string | null
    isPrivate: boolean
    isVerified: boolean
    createdAt: string
    updatedAt: string
}

type Author = Omit<User, "email" | "createdAt" | "updatedAt"> & { displayName: string }

interface Account extends User {
    displayName: string
    fullName: string
    totalCreatedProjects: number
    totalCommentsMade: number
    memberships: unknown[] // TODO: Define Membership type later
    readNotificationsCount: number
    unreadNotificationsCount: number
}

export type { Roles, User, Author, Account }
