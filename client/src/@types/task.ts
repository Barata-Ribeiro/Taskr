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
    description: string
    dueDate: string
    status: TaskStatus
    priority: TaskPriority
    createdAt: string
    updatedAt: string
    assignees: Author[]
}

export { TaskStatus, TaskPriority }

export type { Task }
