import getProjectByOrgIdAndProjectId from "@/actions/projects/get-project-by-org-id-and-project-id"
import getAllTasksByProjectId from "@/actions/tasks/get-all-tasks-by-project-id"
import StateError from "@/components/feedback/state-error"
import Avatar from "@/components/helpers/avatar"
import { ProblemDetails } from "@/interfaces/actions"
import { ProjectInfoResponse, ProjectStatus } from "@/interfaces/project"
import { CompleteTask, ProjectSortedTasks, TaskPriority, TaskStatus } from "@/interfaces/task"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Fragment } from "react"
import { twMerge } from "tailwind-merge"

interface ProjectPageProps {
    params: {
        id: string
        projectId: string
    }
}

export async function generateMetadata({ params }: Readonly<ProjectPageProps>) {
    const projectState = await getProjectByOrgIdAndProjectId({ orgId: +params.id, projectId: +params.projectId })
    if (projectState.error) return { title: "Project", description: "Project Page" }

    const projectData = projectState.response?.data as ProjectInfoResponse
    return {
        title: `Project ${projectData.project.name}`,
        description: `You are viewing project '${projectData.project.name}'. Its description is '${projectData.project.description}'; Currently, it has ${projectData.project.tasksCount} tasks. The project was created on ${parseDate(
            projectData.project.createdAt,
        )} and last updated on ${parseDate(
            projectData.project.updatedAt,
        )}. The project deadline is ${parseDate(projectData.project.deadline)}.`,
    }
}

export default async function ProjectPage({ params }: Readonly<ProjectPageProps>) {
    if (!params.id || !params.projectId) return notFound()

    const projectStatePromise = getProjectByOrgIdAndProjectId({ orgId: +params.id, projectId: +params.projectId })
    const tasksStatePromise = getAllTasksByProjectId({ orgId: +params.id, projectId: +params.projectId })

    const [projectState, taskState] = await Promise.all([projectStatePromise, tasksStatePromise])
    if (projectState.error || taskState.error)
        return <StateError error={(projectState ?? taskState).error as ProblemDetails} />

    const projectData = projectState.response?.data as ProjectInfoResponse
    const tasksData = taskState.response?.data as ProjectSortedTasks

    const projectStatus = projectData.project.status
        ? projectData.project.status
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char: string) => char.toUpperCase())
        : "N/A"

    const projectStatusColor = projectData.project.status
        ? getProjectStatusColor(projectData.project.status)
        : "text-ebony-500 bg-ebony-100"

    return (
        <Fragment>
            {/* Project Details */}
            <section
                id="project-info-section"
                aria-labelledby="project-info-section-title"
                className="mb-12 mt-8 rounded-lg bg-white shadow-derek">
                <header className="flex flex-col items-start justify-between gap-x-8 gap-y-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                    <div className="inline-flex items-center gap-x-3">
                        <span
                            aria-label={`Project Status: ${projectStatus}`}
                            title={`Project Status: ${projectStatus}`}
                            className={twMerge("flex-none rounded-full bg-opacity-10 p-1", projectStatusColor)}>
                            <div aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
                        </span>
                        <h1 id="project-info-section-title" className="text-4xl font-medium text-ebony-900">
                            {projectData.project.name}
                        </h1>
                    </div>

                    <span className="order-first flex-none select-none rounded-md bg-ebony-50 px-2 py-1 text-xs font-medium text-ebony-700 ring-1 ring-inset ring-ebony-700/10 sm:order-none">
                        {projectData.project.isManager ? "Project Manager" : "Project Member"}
                    </span>
                </header>

                <div className="border-t border-gray-100 px-4 py-6 sm:px-6">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Project Details</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{projectData.project.description}</p>
                </div>

                <div className="border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                <span className="sr-only">Project Status</span>Status
                            </dt>
                            <dd className="mt-1 inline-flex items-center gap-x-2 sm:col-span-2 sm:mt-0">
                                <span
                                    aria-hidden="true"
                                    className={twMerge("flex-none rounded-full bg-opacity-10 p-1", projectStatusColor)}>
                                    <div aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
                                </span>
                                <p
                                    aria-label={`Project Status: ${projectStatus}`}
                                    className="text-sm leading-6 text-gray-700">
                                    {projectStatus}
                                </p>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">About</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                {projectData.project.description}
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                <span className="sr-only">Project Deadline</span>Deadline
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <time dateTime={projectData.project.deadline}>
                                    {parseDate(projectData.project.deadline)}
                                </time>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Started at</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <time dateTime={projectData.project.createdAt}>
                                    {parseDate(projectData.project.createdAt)}
                                </time>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Last Updated</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <time dateTime={projectData.project.updatedAt}>
                                    {parseDate(projectData.project.updatedAt)}
                                </time>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">Leader</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <Link
                                    href={`/dashboard/profile/${projectData.project.manager?.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="group block w-max flex-shrink-0">
                                    <div className="flex items-center">
                                        <Avatar
                                            src={projectData.project.manager?.avatarUrl ?? ""}
                                            size={32}
                                            name={
                                                projectData.project.manager?.fullName ??
                                                projectData.project.manager?.displayName ??
                                                ""
                                            }
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                {projectData.project.manager?.fullName ??
                                                    projectData.project.manager?.displayName}
                                            </p>
                                            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                                                View profile
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Tasks Section */}
            <section id="project-tasks-section" aria-labelledby="project-tasks-section-title" className="mb-8">
                <h2 id="project-tasks-section-title" className="mb-6 font-heading text-3xl text-ebony-700">
                    Tasks
                </h2>

                {/* High Priority Tasks */}
                <TaskCategory
                    title="High Priority"
                    tasks={tasksData.tasks.highPriority}
                    priorityColor="text-english-holly-600"
                />

                {/* Medium Priority Tasks */}
                <TaskCategory
                    title="Medium Priority"
                    tasks={tasksData.tasks.mediumPriority}
                    priorityColor="text-yellow-500"
                />

                {/* Low Priority Tasks */}
                <TaskCategory title="Low Priority" tasks={tasksData.tasks.lowPriority} priorityColor="text-green-500" />
            </section>
        </Fragment>
    )
}

interface TaskCategoryProps {
    title: string
    tasks: CompleteTask[]
    priorityColor: string
}

const TaskCategory: React.FC<TaskCategoryProps> = ({ title, tasks, priorityColor }) => {
    if (tasks.length === 0) return null

    return (
        <div className="mb-8">
            <h3 className={`mb-4 font-heading text-2xl ${priorityColor}`}>{title}</h3>
            <div className="space-y-4">
                {tasks.map(completeTask => (
                    <TaskCard key={completeTask.task.id} data={completeTask} />
                ))}
            </div>
        </div>
    )
}

interface TaskCardProps {
    data: CompleteTask
}

const TaskCard: React.FC<TaskCardProps> = ({ data }) => {
    const statusColor = getTaskStatusColor(data.task.status)
    const priorityColor = getTaskPriorityColor(data.task.priority)

    return (
        <div className="flex flex-col rounded-lg bg-white p-6 shadow-standard md:flex-row md:justify-between">
            <div>
                <h4 className="mb-2 font-heading text-xl text-ebony-800">{data.task.title}</h4>
                <p className="mb-4 font-body text-base text-ebony-500">{data.task.description}</p>
                <div className="flex flex-wrap items-center text-sm text-ebony-400">
                    <span className={`mr-6 flex items-center ${statusColor}`}>
                        <span className={`mr-2 inline-block h-2 w-2 rounded-full bg-current`}></span>
                        {data.task.status.replace("_", " ")}
                    </span>
                    <span className={`mr-6 ${priorityColor}`}>
                        <strong>Priority:</strong> {data.task.priority}
                    </span>
                    <span className="mr-6">
                        <strong>Start:</strong> {parseDate(data.task.startDate)}
                    </span>
                    <span>
                        <strong>Due:</strong> {parseDate(data.task.dueDate)}
                    </span>
                </div>
            </div>
            <div className="mt-4 flex items-center md:mt-0">
                {data.userAssigned && (
                    <div className="mr-4 flex items-center">
                        <Avatar
                            src={data.userAssigned.avatarUrl}
                            size={32}
                            name={data.userAssigned.fullName ?? data.userAssigned.displayName}
                        />
                        <span className="ml-2 text-sm text-ebony-600">
                            {data.userAssigned.fullName ?? data.userAssigned.displayName}
                        </span>
                    </div>
                )}
                {data.userCreator && (
                    <div className="flex items-center">
                        <span className="text-sm text-ebony-400">Created by:</span>
                        <Avatar
                            src={data.userCreator.avatarUrl}
                            size={32}
                            name={data.userCreator.fullName ?? data.userCreator.displayName}
                        />
                        <span className="ml-2 text-sm text-ebony-600">
                            {data.userCreator.fullName ?? data.userCreator.displayName}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

const getProjectStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case "AWAITING_APPROVAL":
            return "text-yellow-500 bg-yellow-500"
        case "ACTIVE":
            return "text-green-500 bg-green-100"
        case "INACTIVE":
            return "text-gray-500 bg-gray-100"
        case "COMPLETED":
            return "text-blue-500 bg-blue-100"
        default:
            return "text-ebony-500 bg-ebony-100"
    }
}

const getTaskStatusColor = (status: TaskStatus) => {
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

const getTaskPriorityColor = (priority: TaskPriority) => {
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
