import { Task } from "@/@types/task"
import TaskPriorityBadge from "@/components/task/TaskPriorityBadge"
import dateFormatter from "@/utils/date-formatter"
import Link from "next/link"

interface TaskListItemProps {
    projectId: number
    task: Task
    baseUrl: string
}

export default function TaskListItem({ projectId, task, baseUrl }: Readonly<TaskListItemProps>) {
    const taskUrl = `${baseUrl}/projects/${projectId}/tasks/${task.id}`

    return (
        <li className="mb-4">
            <div className="flex items-center justify-between gap-2">
                <Link
                    href={taskUrl}
                    className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500"
                    aria-label={`View task "${task.title}" details`}
                    title={`View task "${task.title}" details`}>
                    <h4 className="text-lg font-medium">{task.title}</h4>
                </Link>
                <time dateTime={task.dueDate} className="text-sm text-gray-500 dark:text-gray-400">
                    Due {dateFormatter(task.dueDate, { dateStyle: "full" })}
                </time>
            </div>

            <div className="flex items-center justify-between gap-2">
                <p className="mt-1 text-gray-600 dark:text-gray-300">{task.description}</p>
                <TaskPriorityBadge taskPriority={task.priority} />
            </div>
        </li>
    )
}
