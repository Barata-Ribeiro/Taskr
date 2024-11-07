import getProjectByOrgIdAndProjectId from "@/actions/projects/get-project-by-org-id-and-project-id"
import getAllTasksByProjectId from "@/actions/tasks/get-all-tasks-by-project-id"
import StateError from "@/components/feedback/state-error"
import Avatar from "@/components/helpers/avatar"
import { ProblemDetails } from "@/interfaces/actions"
import { ProjectResponse } from "@/interfaces/project"
import { CompleteTask, ProjectSortedTasks, TaskPriority, TaskStatus } from "@/interfaces/task"
import parseDate from "@/utils/parse-date"
import { notFound } from "next/navigation"
import { Fragment } from "react"

interface ProjectPageProps {
    params: {
        id: string
        projectId: string
    }
}

export async function generateMetadata({ params }: Readonly<ProjectPageProps>) {
    const projectState = await getProjectByOrgIdAndProjectId({ orgId: +params.id, projectId: +params.projectId })
    if (projectState.error) return { title: "Project", description: "Project Page" }

    const projectData = projectState.response?.data as ProjectResponse
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

    const projectData = projectState.response?.data as ProjectResponse
    const tasksData = taskState.response?.data as ProjectSortedTasks

    console.log(projectData)
    console.log(tasksData)

    return (
        <Fragment>
            {/* Project Details */}
            <section id="project-info-section" aria-labelledby="project-info-section-title" className="mb-12 mt-8">
                <h1 id="project-info-section-title" className="mb-4 font-heading text-4xl text-ebony-700">
                    {projectData.project.name}
                </h1>
                <p className="mb-2 font-body text-base text-ebony-500">{projectData.project.description}</p>
                <div className="mb-4 flex flex-wrap items-center text-sm text-ebony-400">
                    <span className="mr-6 capitalize">
                        <strong>Status:</strong> {projectData.project.status.toLowerCase().replace("_", " ") || "N/A"}
                    </span>
                    {projectData.project.manager && (
                        <span className="mr-6 inline-flex items-center gap-2">
                            <Avatar
                                src={projectData.project.manager.avatarUrl}
                                size={32}
                                name={projectData.project.manager.fullName ?? projectData.project.manager.displayName}
                            />
                            {projectData.project.manager.fullName ?? projectData.project.manager.displayName}
                        </span>
                    )}
                    <span className="mr-6">
                        <strong>Created:</strong> {parseDate(projectData.project.createdAt)}
                    </span>
                    <span className="mr-6">
                        <strong>Updated:</strong> {parseDate(projectData.project.updatedAt)}
                    </span>
                    <span className="mr-6">
                        <strong>Deadline:</strong> {parseDate(projectData.project.deadline)}
                    </span>
                    <span>
                        <strong>Total Tasks:</strong> {projectData.project.tasksCount}
                    </span>
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
    const statusColor = getStatusColor(data.task.status)
    const priorityColor = getPriorityColor(data.task.priority)

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

const getStatusColor = (status: TaskStatus) => {
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

const getPriorityColor = (priority: TaskPriority) => {
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
