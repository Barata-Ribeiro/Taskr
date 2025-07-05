import { TaskPriority } from "@/@types/task"
import { AlertCircleIcon, ClockIcon, ZapIcon } from "lucide-react"

interface TaskPriorityIconProps {
    taskPriority: TaskPriority
}

export default function TaskPriorityIcon({ taskPriority }: Readonly<TaskPriorityIconProps>) {
    switch (taskPriority) {
        case "URGENT":
            return <ZapIcon aria-hidden className="size-4 text-red-600" />
        case "HIGH":
            return <AlertCircleIcon aria-hidden className="size-4 text-orange-600" />
        case "MEDIUM":
            return <ClockIcon aria-hidden className="size-4 text-yellow-600" />
        case "LOW":
            return <ClockIcon aria-hidden className="size-4 text-gray-600" />
        default:
            return <ClockIcon aria-hidden className="size-4 text-gray-600" />
    }
}
