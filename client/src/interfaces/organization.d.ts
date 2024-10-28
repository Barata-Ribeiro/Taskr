import { User } from "@/interfaces/user"

interface Organization {
    id: number
    name: string
    description: string | null
    membersCount: number
    projectsCount: number
    logoUrl: string | null
    websiteUrl: string | null
    location: string | null
    createdAt: string
    updatedAt: string
}

interface SimpleOrganization {
    id: string
    name: string
}

interface OrganizationMembersList {
    organization: Organization
    owner: User
    admins: User[]
    members: User[]
}

interface OrganizationProjectsList {
    organization: Organization
    projects: Project[]
}

export type { Organization, SimpleOrganization, OrganizationMembersList, OrganizationProjectsList }
