interface RequestingTeamDataBody {
    name: string
    description: string
}

interface TeamQueryRequest {
    withMembers: boolean
    withProjects: boolean
}

interface RequestingTeamEditDataBody {
    name?: string
    description?: string
    usersUsername?: string[]
}
