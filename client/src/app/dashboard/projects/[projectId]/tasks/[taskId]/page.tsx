import getTaskByProjectAndTaskId from "@/actions/tasks/get-task-by-project-and-task-id"
import getUserContext from "@/actions/user/get-user-context"
import StateError from "@/components/feedback/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { TaskResponse } from "@/interfaces/task"
import { UserContext } from "@/interfaces/user"
import { notFound, redirect } from "next/navigation"

interface TaskPageProps {
    params: {
        projectId: string
        taskId: string
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
    const task = taskState.response?.data as TaskResponse

    if (context.projectsWhereUserIsMember.find(project => project.id !== task.project.id)) return redirect("/dashboard")

    return <div></div>
}
