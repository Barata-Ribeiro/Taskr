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

export function getTaskStatusStyle(status: TaskStatus) {
    switch (status) {
        case "OPEN":
            return "text-green-700 bg-green-50 ring-green-600/20"
        case "IN_PROGRESS":
            return "text-yellow-800 bg-yellow-50 ring-yellow-600/20"
        case "IN_REVIEW":
            return "text-blue-600 bg-blue-50 ring-blue-500/10"
        case "DONE":
            return "text-gray-600 bg-gray-50 ring-gray-500/10"
        default:
            return "text-ebony-600 bg-ebony-50 ring-ebony-500/10"
    }
}

export function getTaskStatusColor(status: TaskStatus) {
    switch (status) {
        case "OPEN":
            return "green"
        case "IN_PROGRESS":
            return "yellow"
        case "IN_REVIEW":
            return "blue"
        case "DONE":
            return "gray"
        default:
            return "ebony"
    }
}

export function getTaskPriorityColor(priority: TaskPriority) {
    switch (priority) {
        case "HIGH":
            return "text-red-700"
        case "MEDIUM":
            return "text-yellow-800"
        case "LOW":
            return "text-gray-600"
        default:
            return "text-ebony-500"
    }
}
