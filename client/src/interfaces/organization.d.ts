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

interface PaginatedOrganizations {
    content: Organization[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { Organization, SimpleOrganization, PaginatedOrganizations }
