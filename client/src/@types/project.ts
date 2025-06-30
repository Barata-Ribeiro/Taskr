import { Author } from "@/@types/user"

enum ProjectRole {
    MEMBER = "MEMBER",
    OWNER = "OWNER",
}

enum ProjectStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD",
    CANCELLED = "CANCELLED",
}

interface Project {
    id: number
    title: string
    description: string
    dueDate: string
    status: ProjectStatus
    owner: Author
    createdAt: string
    updatedAt: string
}

interface CompleteProject extends Omit<Project, "owner"> {
    memberships: MembershipUser[]
    totalTasks: number
}

type SimpleProject = Pick<Project, "id" | "title" | "status">

interface MembershipUser {
    id: number
    user: Author
    role: ProjectRole
    joinedAt: string
}

interface MembershipProject {
    id: number
    project: SimpleProject
    role: ProjectRole
    joinedAt: string
}

export { ProjectRole, ProjectStatus }

export type { Project, CompleteProject, SimpleProject, MembershipUser, MembershipProject }
