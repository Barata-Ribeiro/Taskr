import getProjectByOrgIdAndProjectId from "@/actions/projects/get-project-by-org-id-and-project-id"
import getAllTasksByProjectId from "@/actions/tasks/get-all-tasks-by-project-id"
import StateError from "@/components/feedback/state-error"
import Avatar from "@/components/helpers/avatar"
import ProjectStatusBadge from "@/components/helpers/project-status-badge"
import { ProblemDetails } from "@/interfaces/actions"
import { ProjectInfoResponse } from "@/interfaces/project"
import { CompleteTask, ProjectSortedTasks } from "@/interfaces/task"
import { getTaskPriorityColor, getTaskStatusColor } from "@/utils/get-color-functions"
import parseDate from "@/utils/parse-date"
import { Button } from "@headlessui/react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Fragment } from "react"
import { FaPencil } from "react-icons/fa6"
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

    const isManager = projectData.project.isManager

    return (
        <Fragment>
            {/* Project Details */}
            <section
                id="project-info-section"
                aria-labelledby="project-info-section-title"
                className="mb-12 mt-8 rounded-lg bg-white shadow-derek">
                <header className="flex flex-col items-start justify-between gap-x-8 gap-y-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
                    <div className="inline-flex items-center gap-x-3">
                        <ProjectStatusBadge status={projectData.project?.status} type="icon-only" />
                        <h1 id="project-info-section-title" className="text-4xl font-medium text-ebony-900">
                            {projectData.project.name}
                        </h1>
                    </div>

                    <div className="order-first inline-flex items-center gap-x-2 sm:order-none">
                        <Link
                            href={`/dashboard/projects/${projectData.project.id}/manage?orgId=${params.id}`}
                            className={twMerge(
                                "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                                !isManager ? "pointer-events-none cursor-default opacity-50" : "",
                            )}>
                            <FaPencil aria-hidden="true" className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" />
                            Manage
                        </Link>
                        <span className="flex-none select-none rounded-md bg-ebony-50 px-2 py-1 text-xs font-medium text-ebony-700 ring-1 ring-inset ring-ebony-700/10 sm:order-none">
                            {isManager ? "Project Manager" : "Project Member"}
                        </span>
                    </div>
                </header>

                <div className="border-t border-gray-100 px-4 py-6 sm:px-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Project Details</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                        Here are the details of the project you are currently viewing. If you are the project manager,
                        you can manage the project by clicking on the &ldquo;Manage&rdquo; button.
                    </p>
                </div>

                <div className="border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                <span className="sr-only">Project Status</span>Status
                            </dt>
                            <dd className="mt-1 inline-flex items-center gap-x-2 sm:col-span-2 sm:mt-0">
                                <ProjectStatusBadge status={projectData.project?.status} type="full" />
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
            <section
                id="project-tasks-section"
                aria-labelledby="project-tasks-section-title"
                className="mb-12 mt-8 rounded-lg bg-white shadow-derek">
                <header className="flex flex-col items-start justify-between gap-x-8 gap-y-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
                    <div className="inline-flex items-center gap-x-2">
                        <h2 id="project-tasks-section-title" className="text-3xl font-medium text-ebony-900">
                            Tasks
                        </h2>
                        <span className="text-sm font-medium text-ebony-400">
                            ({projectData.project.tasksCount} tasks)
                        </span>
                    </div>

                    <Button>New Task</Button>
                </header>

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
