import { Project } from "@/interfaces/project"
import { User } from "@/interfaces/user"

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

interface CompleteTask {
    task: Task
    userAssigned: User | null
    userCreator: User
}

interface TaskPayload extends Task {
    creator: User
    assigned: User[]
}

interface SortedTasks {
    lowPriority: CompleteTask[]
    mediumPriority: CompleteTask[]
    highPriority: CompleteTask[]
}

interface ProjectSortedTasks {
    project: Project
    tasks: SortedTasks
}

interface TaskResponse {
    project: Project
    task: TaskPayload
}

export type { TaskStatus, TaskPriority, Task, CompleteTask, SortedTasks, ProjectSortedTasks, TaskPayload, TaskResponse }
