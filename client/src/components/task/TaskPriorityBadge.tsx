import { TaskPriority } from "@/@types/task"
import TaskPriorityIcon from "@/components/task/TaskPriorityIcon"
import normalizeBadgeString from "@/utils/badge-string-normalizer"
import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface TaskPriorityBadgeProps {
    taskPriority: TaskPriority
}

export default function TaskPriorityBadge({ taskPriority }: Readonly<TaskPriorityBadgeProps>) {
    const priorityColor = {
        URGENT: tw`bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`,
        HIGH: tw`bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300`,
        MEDIUM: tw`bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`,
        LOW: tw`bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`,
    }

    const defaultPriorityStyles = tw`rounded-full px-2 py-1 text-xs font-medium capitalize select-none`

    const priorityClasses = twMerge(priorityColor[taskPriority], defaultPriorityStyles)

    const text = normalizeBadgeString(taskPriority)

    return (
        <div
            aria-label={`Task priority: ${text}`}
            title={`Task priority: ${text}`}
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-x-2">
            <TaskPriorityIcon taskPriority={taskPriority} />
            <span className={priorityClasses}>{text}</span>
        </div>
    )
}
