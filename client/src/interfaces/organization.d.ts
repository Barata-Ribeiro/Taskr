import { Paginated } from "@/interfaces/actions"
import { OrganizationProject } from "@/interfaces/project"
import { OrganizationMember } from "@/interfaces/user"

interface Organization {
    id: number
    name: string
    description: string
    membersCount: number
    projectsCount: number
    logoUrl: string | null
    websiteUrl: string | null
    location: string | null
    createdAt: string
    updatedAt: string
}

interface SimpleOrganization {
    id: number
    name: string
    isOwner: boolean
    isAdmin: boolean
}

interface OrganizationMembersList {
    organization: Organization
    members: Paginated<OrganizationMember>
}

interface OrganizationProjectsList {
    organization: Organization
    projects: Paginated<OrganizationProject>
}

export type { Organization, SimpleOrganization, OrganizationMembersList, OrganizationProjectsList }
