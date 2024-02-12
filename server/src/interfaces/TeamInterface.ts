interface RequestingTeamDataBody {
    name: string
    description: string
}

interface TeamQueryRequest {
    withMembers: boolean
    withProjects: boolean
}