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

export type { Organization, SimpleOrganization }
