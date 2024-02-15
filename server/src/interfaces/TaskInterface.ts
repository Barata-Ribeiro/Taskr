import { TaskPriority } from "../entities/task/PriorityEnum"
import { TaskStatus } from "../entities/task/StatusEnum"

export interface RequestingTaskDataBody {
    title: string
    description: string
    projectId: string
    dueDate: string
    status?: TaskStatus
    priority?: TaskPriority
    tags?: string[]
}
