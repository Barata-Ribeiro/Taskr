interface Organization {
    id: number
    name: string
    description: string
    membersCount: number
    projectsCount: number
    logoUrl: string
    websiteUrl: string
    location: string
    createdAt: string
    updatedAt: string
}

interface SimpleOrganization {
    id: string
    name: string
}

export type { Organization, SimpleOrganization }
