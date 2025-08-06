import { ProblemDetails } from "@/@types/application"
import { Author } from "@/@types/user"
import getTaskById from "@/actions/task/get-task-by-id"
import EditTaskModal from "@/components/modals/EditTaskModal"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import SafeMarkdown from "@/components/shared/SafeMarkdown"
import DueDateBadge from "@/components/shared/task/DueDateBadge"
import Tooltip from "@/components/shared/Tooltip"
import TaskCompleteStatusBadge from "@/components/task/TaskCompleteStatusBadge"
import TaskPriorityBadge from "@/components/task/TaskPriorityBadge"
import Avatar from "@/components/user/Avatar"
import Link from "next/link"

interface TaskDetailsProps {
    projectId: number
    taskId: number
    baseUrl: string
}

export default async function TaskDetails({ projectId, taskId, baseUrl }: Readonly<TaskDetailsProps>) {
    const taskResponse = await getTaskById(projectId, taskId)

    if (!taskResponse.ok || !taskResponse.response?.data) {
        const isProblemDetails = (taskResponse.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (taskResponse.error as ProblemDetails).detail
            : "An error occurred while fetching the task details."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const task = taskResponse.response.data

    return (
        <article className="block rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
                <div className="inline-flex items-center gap-x-2">
                    <TaskPriorityBadge taskPriority={task.priority} />
                    <EditTaskModal task={task} />
                </div>
            </div>

            <div className="inline-flex items-center gap-x-4">
                <DueDateBadge date={task.dueDate} />
                {task.status === "DONE" ? <TaskCompleteStatusBadge /> : <DueDateBadge date={task.dueDate} />}
            </div>

            <SafeMarkdown markdown={task.description} />

            <div className="mb-4 space-y-2">
                <span className="block text-sm font-semibold text-gray-600 dark:text-gray-400">Assignees:</span>

                <div className="flex flex-wrap items-center gap-2">
                    {task.assignees && task.assignees.length > 0 ? (
                        task.assignees.map((assignee: Author) => {
                            const assigneeUrl = `${baseUrl}/profile/${assignee.username}`
                            const label = `View ${assignee.displayName}'s profile`

                            return (
                                <Link
                                    href={assigneeUrl}
                                    key={assignee.id}
                                    aria-label={label}
                                    title={label}
                                    className="group relative flex items-center gap-2 rounded-full bg-gray-100 py-1 pr-3 pl-1 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <Avatar url={assignee.avatarUrl} name={assignee.displayName} size="extra-small" />

                                    <span className="text-xs text-gray-800 group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-400">
                                        {assignee.displayName}
                                    </span>

                                    <Tooltip content={`@${assignee.username}`} />
                                </Link>
                            )
                        })
                    ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">No assignees</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row dark:text-gray-400">
                <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                <span>Last updated: {new Date(task.updatedAt).toLocaleString()}</span>
            </div>
        </article>
    )
}
