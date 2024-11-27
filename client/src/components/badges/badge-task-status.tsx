import { TaskStatus } from "@/interfaces/task"
import { getTaskStatusColor } from "@/utils/get-color-functions"
import { twMerge } from "tailwind-merge"

interface BadgeTaskStatusProps {
    status: TaskStatus
}

export default function BadgeTaskStatus({ status }: BadgeTaskStatusProps) {
    const statusColor = getTaskStatusColor(status)

    const statusText = status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase())

    const statusIconStyle = `text-${statusColor}-500 bg-${statusColor}-500 ring-${statusColor}-600/10`

    return (
        <span
            aria-label={`Task Status: ${statusText}`}
            title={`Task Status: ${statusText}`}
            className={twMerge("flex-none rounded-full bg-opacity-10 p-1", statusIconStyle)}>
            <div aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
        </span>
    )
}
