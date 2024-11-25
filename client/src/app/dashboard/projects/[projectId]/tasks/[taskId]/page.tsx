import getTaskByProjectAndTaskId from "@/actions/tasks/get-task-by-project-and-task-id"
import getUserContext from "@/actions/user/get-user-context"
import Badge from "@/components/badges/badge"
import BadgePriority from "@/components/badges/badge-priority"
import Divider from "@/components/divider"
import StateError from "@/components/feedback/state-error"
import Avatar from "@/components/helpers/avatar"
import { ProblemDetails } from "@/interfaces/actions"
import { TaskResponse } from "@/interfaces/task"
import { UserContext } from "@/interfaces/user"
import parseDate from "@/utils/parse-date"
import { notFound, redirect } from "next/navigation"
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

    return (
        <article
            id="task-info"
            aria-labelledby="task-info-title"
            aria-describedby="task-info-description"
            className="rounded-lg bg-white shadow-derek">
            <header className="flex flex-col space-y-1.5 p-6">
                <h1 id="task-info-title" className="text-2xl font-semibold leading-none tracking-tight text-ebony-900">
                    {data.task.title}
                </h1>
                <p id="task-info-description" className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                    {data.task.description}
                </p>
            </header>

            <div className="p-6 pt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Task Details</h3>
                        <p className="text-muted-foreground mb-4 text-sm">{data.task.description}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Status:</span>
                                <Badge variant={data.task.status === "OPEN" ? "default" : "secondary"}>
                                    {data.task.status}
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
                        <div>
                            <p className="text-sm font-medium">Creator:</p>
                            <div className="mt-1 flex items-center">
                                <Avatar
                                    name={data.task.creator.fullName ?? data.task.creator.displayName}
                                    size={32}
                                    src={data.task.creator.avatarUrl}
                                />
                                <span className="ml-2 text-sm">{data.task.creator.displayName}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Assigned:</p>
                            {data.task.assigned.length > 0 ? (
                                <div className="mt-1 flex items-center">
                                    {data.task.assigned.map(user => (
                                        <Avatar
                                            key={user.id}
                                            name={user.fullName ?? user.displayName}
                                            size={32}
                                            src={user.avatarUrl}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground mt-1 text-sm">No one assigned</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
