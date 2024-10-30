import { SimpleOrganization } from "@/interfaces/organization"
import { SimpleProject } from "@/interfaces/project"

type UserRoles = "NONE" | "SERVICE_ADMIN" | "SERVICE_USER" | "BANNED"

interface User {
    id: string
    username: string
    displayName: string
    fullName: string
    avatarUrl: string
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
    avatarUrl: string
    email: string
    role: UserRoles
    createdAt: string
    updatedAt: string
}

interface UserContext {
    context: User
    projectsWhereUserIsMember: SimpleProject[]
    totalProjectsWhereUserIsMember: number
    organizationsWhereUserIsMember: SimpleOrganization[]
    totalOrganizationsWhereUserIsMember: number
}

interface UserDashboard {
    context: User
    organizationsWhereUserIsMember: SimpleOrganization[]
    projectsWhereUserIsMember: SimpleProject[]
}

type OrganizationMemberRole = "Admin" | "Owner" | "Member"

interface OrganizationMember {
    user: Profile
    roles: OrganizationMemberRole[]
}

export type { UserRoles, User, Profile, UserContext, UserDashboard, OrganizationMemberRole, OrganizationMember }
