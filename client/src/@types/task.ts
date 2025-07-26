import { Author } from "@/@types/user"

enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

interface Task {
    id: number
    title: string
    summary: string
    description: string
    dueDate: string
    status: TaskStatus
    priority: TaskPriority
    position: number
    createdAt: string
    updatedAt: string
    assignees: Author[]
}

interface TasksByStatus {
    toDo: Task[]
    inProgress: Task[]
    done: Task[]
}

interface MoveRequest {
    projectId: number
    newStatus: string
    newPosition: number
}

interface ReorderRequest {
    status: string
    taskIds: number[]
}

export { TaskStatus, TaskPriority }

export type { Task, TasksByStatus, MoveRequest, ReorderRequest }
