type TaskStatus = "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
type TaskPriority = "LOW" | "MEDIUM" | "HIGH"

interface Task {
    id: number
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    startDate: string
    dueDate: string
    createdAt: string
    updatedAt: string
}

export type { Task, TaskStatus, TaskPriority }
