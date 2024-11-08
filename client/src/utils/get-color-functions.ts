import { ProjectStatus } from "@/interfaces/project"
import { TaskPriority, TaskStatus } from "@/interfaces/task"

export function getProjectStatusColor(status: ProjectStatus) {
    switch (status) {
        case "AWAITING_APPROVAL":
            return "yellow"
        case "ACTIVE":
            return "green"
        case "INACTIVE":
            return "gray"
        case "COMPLETED":
            return "blue"
        default:
            return "ebony"
    }
}

export function getTaskStatusColor(status: TaskStatus) {
    switch (status) {
        case "OPEN":
            return "text-green-500"
        case "IN_PROGRESS":
            return "text-yellow-500"
        case "IN_REVIEW":
            return "text-blue-500"
        case "DONE":
            return "text-gray-500"
        default:
            return "text-ebony-500"
    }
}

export function getTaskPriorityColor(priority: TaskPriority) {
    switch (priority) {
        case "HIGH":
            return "text-english-holly-600"
        case "MEDIUM":
            return "text-yellow-500"
        case "LOW":
            return "text-green-500"
        default:
            return "text-ebony-500"
    }
}
