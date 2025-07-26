import { TaskStatus } from "@/@types/task"
import normalizeBadgeString from "@/utils/badge-string-normalizer"
import statusStringNormalizer from "@/utils/status-string-normalizer"
import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface TaskStatusBadgeProps {
    status: TaskStatus
}

export default function TaskStatusBadge({ status }: Readonly<TaskStatusBadgeProps>) {
    const textStatus = normalizeBadgeString(statusStringNormalizer(status))

    const statusColor = {
        TO_DO: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        DONE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }

    const defaultStatusStyle = tw`inline-block rounded-full px-2 py-1 text-xs font-medium capitalize select-none`

    const mergedClasses = twMerge(defaultStatusStyle, statusColor[status])

    return (
        <span className={mergedClasses} role="status" aria-label={textStatus}>
            {textStatus}
        </span>
    )
}
