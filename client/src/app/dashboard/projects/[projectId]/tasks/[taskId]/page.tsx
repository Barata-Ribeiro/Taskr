import getTaskByProjectAndTaskId from "@/actions/tasks/get-task-by-project-and-task-id"
import getUserContext from "@/actions/user/get-user-context"
import UpdateTaskButton from "@/components/actions/update-task-button"
import Badge from "@/components/badges/badge"
import BadgePriority from "@/components/badges/badge-priority"
import Divider from "@/components/divider"
import StateError from "@/components/feedback/state-error"
import Avatar from "@/components/helpers/avatar"
import { ProblemDetails } from "@/interfaces/actions"
import { TaskResponse } from "@/interfaces/task"
import { UserContext } from "@/interfaces/user"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Fragment } from "react"
import { FaUserGroup } from "react-icons/fa6"

interface TaskPageProps {
    params: {
        projectId: string
        taskId: string
    }
}

export async function generateMetadata({ params }: Readonly<TaskPageProps>) {
    const taskState = await getTaskByProjectAndTaskId({ projectId: params.projectId, taskId: params.taskId })
    if (taskState.error) return notFound()

    const data = taskState.response?.data as TaskResponse

    return {
        title: "Task: " + data.task.title,
        description: "Task description: " + data.task.description,
    }
}

export default async function TaskPage({ params }: Readonly<TaskPageProps>) {
    if (!params.projectId || !params.taskId) return notFound()

    const contextStatePromise = getUserContext()
    const taskStatePromise = getTaskByProjectAndTaskId({ projectId: params.projectId, taskId: params.taskId })

    const [contextState, taskState] = await Promise.all([contextStatePromise, taskStatePromise])
    if (contextState.error || taskState.error) {
        const error = contextState.error || taskState.error
        return <StateError error={error as ProblemDetails} />
    }

    const context = contextState.response?.data as UserContext
    const data = taskState.response?.data as TaskResponse

    if (context.projectsWhereUserIsMember.find(project => project.id !== data.project.id)) return redirect("/dashboard")

    const isManager =
        context.projectsWhereUserIsMember.find(project => project.id === data.project.id)?.isManager ?? false

    const statusText = data.task.status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase())

    return (
        <Fragment>
            <div className="mb-5 border-b border-gray-200 pb-5">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Task</h1>
                <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    You are viewing a task from the project <span className="font-semibold">{data.project.name}</span>.
                </p>
            </div>

            <article
                id="task-info"
                aria-labelledby="task-info-title"
                aria-describedby="task-info-description"
                className="rounded-lg bg-white shadow-derek">
                <header className="flex flex-col items-start justify-between gap-x-8 gap-y-4 border-b border-gray-100 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
                    <div className="grid gap-x-2">
                        <h2
                            id="task-info-title"
                            className="text-2xl font-semibold leading-none tracking-tight text-ebony-900">
                            {data.task.title}
                        </h2>
                        <p id="task-info-description" className="mt-1 max-w-4xl text-base text-gray-500">
                            {data.task.description}
                        </p>
                    </div>

                    <div className="order-first inline-flex items-center gap-x-2 sm:order-none">
                        <UpdateTaskButton projectId={params.projectId} isManager={isManager} task={data.task} />

                        <span className="flex-none select-none rounded-md bg-ebony-50 px-2 py-1 text-xs font-medium text-ebony-700 ring-1 ring-inset ring-ebony-700/10">
                            {isManager ? "Project Manager" : "Project Member"}
                        </span>
                    </div>
                </header>

                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="mb-2 text-lg font-semibold">Task Details</h3>
                            <p className="text-muted-foreground mb-4 text-sm">{data.task.description}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Status:</span>
                                    <Badge variant={data.task.status === "OPEN" ? "default" : "secondary"}>
                                        {statusText}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Priority:</span>
                                    <BadgePriority priority={data.task.priority} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Start Date:</span>
                                    <span>{parseDate(data.task.startDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Due Date:</span>
                                    <span>{parseDate(data.task.dueDate)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 text-lg font-semibold">Project Details</h3>
                            <p className="text-muted-foreground mb-4 text-sm">{data.project.description}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Deadline:</span>
                                    <span>{parseDate(data.project.deadline)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Members:</span>
                                    <span>{data.project.membersCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Total Tasks:</span>
                                    <span>{data.project.tasksCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider>
                        <FaUserGroup aria-hidden="true" className="h-5 w-5 text-gray-500" />
                    </Divider>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold">People</h3>
                        <div className="flex items-center space-x-4">
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">Creator:</p>
                                <Link
                                    href={`/dashboard/profile/${data.task.creator.id}`}
                                    aria-label={`View ${data.task.creator.displayName}'s profile`}
                                    title={`View ${data.task.creator.displayName}'s profile`}
                                    className="group flex items-center">
                                    <Avatar
                                        name={data.task.creator.fullName ?? data.task.creator.displayName}
                                        size={32}
                                        src={data.task.creator.avatarUrl}
                                    />
                                    <span className="ml-2 text-sm underline-offset-2 group-hover:underline">
                                        {data.task.creator.displayName}
                                    </span>
                                </Link>
                            </div>
                            <div className="grid items-start gap-1">
                                <p className="text-sm font-medium">Assigned:</p>
                                {data.task.assigned.length > 0 ? (
                                    <div className="flex items-center -space-x-2 overflow-hidden">
                                        {data.task.assigned.map(user => (
                                            <Link
                                                key={user.id}
                                                aria-label={`View ${user.displayName}'s profile`}
                                                title={`View ${user.displayName}'s profile`}
                                                href={`/dashboard/profile/${user.id}`}>
                                                <Avatar
                                                    name={user.fullName ?? user.displayName}
                                                    size={32}
                                                    src={user.avatarUrl}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="h-8 min-h-0 text-sm text-gray-400">No one assigned</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Fragment>
    )
}
