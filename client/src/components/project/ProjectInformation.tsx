import { ProblemDetails } from "@/@types/application"
import getProjectById from "@/actions/project/get-project-by-id"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import ProjectStatusBadge from "@/components/shared/project/ProjectStatusBadge"
import dateFormatter from "@/utils/date-formatter"
import { CalendarIcon, MessageSquareIcon, UsersIcon } from "lucide-react"

interface ProjectInformationProps {
    id: number
}

export default async function ProjectInformation({ id }: Readonly<ProjectInformationProps>) {
    const projectResponse = await getProjectById(id)

    if (!projectResponse.ok || !projectResponse.response?.data) {
        const isProblemDetails = (projectResponse.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (projectResponse.error as ProblemDetails).detail
            : "An error occurred while fetching the project details."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const project = projectResponse.response.data

    return (
        <section
            className="space-y-6 overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800"
            aria-labelledby="project-information-heading">
            <div className="sm:flex sm:items-baseline sm:justify-between">
                <div className="sm:flex-1">
                    <h1 id="project-information-heading" className="text-xl font-semibold" tabIndex={-1}>
                        {project.title}
                    </h1>
                    <p
                        className="mt-1 truncate text-gray-500 dark:text-gray-400"
                        aria-label={`Project description: "${project.description}"`}
                        title={`Project description: "${project.description}"`}>
                        {project.description}
                    </p>
                </div>

                <div
                    className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:shrink-0 sm:justify-start"
                    aria-label="Project status">
                    <ProjectStatusBadge status={project.status} type="text" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2" aria-label="Due date">
                    <CalendarIcon size={16} aria-hidden="true" focusable="false" />
                    <div>
                        <p className="text-sm font-medium" id="due-date-label">
                            Due Date
                        </p>
                        <time
                            dateTime={project.dueDate}
                            className="text-sm text-gray-500 dark:text-gray-400"
                            aria-labelledby="due-date-label">
                            {dateFormatter(project.dueDate, { dateStyle: "full" })}
                        </time>
                    </div>
                </div>

                <div className="flex items-center space-x-2" aria-label="Total tasks">
                    <MessageSquareIcon size={16} aria-hidden="true" focusable="false" />
                    <div>
                        <p className="text-sm font-medium" id="total-tasks-label">
                            Total Tasks
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400" aria-labelledby="total-tasks-label">
                            {project.totalTasks}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2" aria-label="Team members">
                    <UsersIcon size={16} aria-hidden="true" focusable="false" />
                    <div>
                        <p className="text-sm font-medium" id="team-members-label">
                            Team Members
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400" aria-labelledby="team-members-label">
                            {project.memberships.length}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
