import { ProblemDetails } from "@/@types/application"
import getLatestTasksByProjectId from "@/actions/task/get-latest-tasks-by-project-id"
import NewTaskModal from "@/components/modals/NewTaskModal"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import TaskListItem from "@/components/task/TaskListItem"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"

interface ProjectTasksProps {
    id: number
    baseUrl: string
}

export default async function ProjectLatestTasks({ id, baseUrl }: Readonly<ProjectTasksProps>) {
    const latestTasksResponse = await getLatestTasksByProjectId(id)

    if (!latestTasksResponse.ok || !latestTasksResponse.response?.data) {
        const isProblemDetails = (latestTasksResponse.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (latestTasksResponse.error as ProblemDetails).detail
            : "An error occurred while fetching the latest tasks."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const latestTasks = latestTasksResponse.response.data

    return (
        <section
            className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800"
            aria-labelledby="project-tasks-heading"
            tabIndex={-1}>
            <div className="px-4 pt-4 sm:flex sm:flex-1 sm:items-center sm:justify-between sm:px-6 sm:pt-6">
                <div className="">
                    <h2 id="project-tasks-heading" className="text-xl font-semibold" tabIndex={-1}>
                        Latest Tasks
                    </h2>
                    <p className="mt-1 truncate text-gray-500 dark:text-gray-400" id="project-tasks-desc">
                        Here are the latest tasks for this project.
                    </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-x-2 sm:mt-0 sm:ml-16 sm:flex-none">
                    <DefaultLinkButton href={`${baseUrl}/projects/${id}/tasks`} width="fit">
                        Task Board
                    </DefaultLinkButton>
                    <NewTaskModal projectId={id} />
                </div>
            </div>

            <ul className="mt-6 border-t border-gray-100 p-4 sm:p-6 dark:border-gray-700">
                {latestTasks.map((task, idx) => (
                    <TaskListItem key={`task-${task.id}-${idx}`} projectId={id} task={task} baseUrl={baseUrl} />
                ))}
            </ul>
        </section>
    )
}
