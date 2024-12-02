import { Organization, SimpleOrganization } from "@/interfaces/organization"
import { Task } from "@/interfaces/task"
import { User } from "@/interfaces/user"

type ProjectStatus = "AWAITING_APPROVAL" | "ACTIVE" | "INACTIVE" | "COMPLETED"

interface Project {
    id: number
    name: string
    description: string
    deadline: string
    membersCount: number
    tasksCount: number
    createdAt: string
    updatedAt: string
    status?: ProjectStatus
    manager?: User
    isManager?: boolean
}

interface SimpleProject {
    id: number
    name: string
    isManager: boolean
    organizationId: number
}

interface DashboardSimpleProject extends SimpleProject {
    latestTasks: Task[]
    totalTasks: number
}

interface OrganizationProject {
    project: Project
    status: ProjectStatus
    isManager?: boolean
}

interface OrganizationProjects {
    organization: Organization
    projects: OrganizationProject[]
}

interface ProjectInfoResponse {
    organization: SimpleOrganization
    project: Project
}

interface ProjectStatusResponse {
    organization: Organization
    project: Project
    newStatus: ProjectStatus
    manager: User
}

interface ProjectMembersResponse {
    members: User[]
}

export type {
    ProjectStatus,
    Project,
    SimpleProject,
    DashboardSimpleProject,
    OrganizationProject,
    OrganizationProjects,
    ProjectInfoResponse,
    ProjectStatusResponse,
    ProjectMembersResponse,
}
