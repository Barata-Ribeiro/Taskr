import { MembershipProject } from "@/@types/project"

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

interface UserProfile extends User {
    bio: string
    displayName: string
    fullName: string | null
    coverUrl: string | null
    pronouns: string | null
    location: string | null
    website: string | null
    company: string | null
    jobTitle: string | null

    totalProjectsParticipated: number
    totalCreatedProjects: number
    totalAssignedTasks: number
    totalCommentsMade: number
}

interface Account extends User {
    displayName: string
    fullName: string
    totalCreatedProjects: number
    totalCommentsMade: number
    memberships: MembershipProject[]
    readNotificationsCount: number
    unreadNotificationsCount: number
}

export { Roles }

export type { User, Author, UserProfile, Account }
