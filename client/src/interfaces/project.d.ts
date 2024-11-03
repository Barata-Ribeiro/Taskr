import { Task } from "@/interfaces/task"

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
    id: number
    name: string
    isManager: boolean
}

interface DashboardSimpleProject extends SimpleProject {
    latestTasks: Task[]
    totalTasks: number
}

interface OrganizationProject {
    project: Project
    status: ProjectStatus
}

export type { ProjectStatus, Project, SimpleProject, DashboardSimpleProject, OrganizationProject }
