type ProjectStatus = "AWAITING_APPROVAL" | "ACTIVE" | "INACTIVE" | "COMPLETED"

interface Project {
    id: string
    name: string
    description: string
    deadline: string
    membersCount: number
    tasksCount: number
    createdAt: string
    updatedAt: string
}

interface SimpleProject {
    id: string
    name: string
}

interface OrganizationProject {
    project: Project
    status: ProjectStatus
}

export type { ProjectStatus, Project, SimpleProject, OrganizationProject }
