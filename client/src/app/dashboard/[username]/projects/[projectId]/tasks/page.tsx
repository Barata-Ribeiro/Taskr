import getTasksByProjectId from "@/actions/task/get-tasks-by-project-id"
import TaskBoard from "@/components/task/TaskBoard"
import { auth } from "auth"
import { notFound, redirect } from "next/navigation"

interface TaskBoardPageProps {
    params: Promise<{ username: string; projectId: string }>
}

export async function generateMetadata({ params }: Readonly<TaskBoardPageProps>) {
    const { username, projectId } = await params
    if (!username || !projectId) return notFound()

    return {
        title: "Task Board",
        description: "This is the task board for managing tasks in the project.",
        openGraph: {
            title: "Task Board",
            description: "This is the task board for managing tasks in the project.",
            url: `/dashboard/${username}/projects/${projectId}/tasks`,
        },
    }
}

export default async function TaskBoardPage({ params }: Readonly<TaskBoardPageProps>) {
    const [{ username, projectId }, session] = await Promise.all([params, auth()])
    if (!username || !projectId || !session) return notFound()

    const dashboardUrl = `/dashboard/${session.user.username}`
    const baseUrl = `${dashboardUrl}/projects/${projectId}`
    if (session.user.username !== username) return redirect(`${baseUrl}/tasks`)

    const tasksResponse = await getTasksByProjectId(parseInt(projectId))
    if (!tasksResponse.ok || !tasksResponse.response?.data) return notFound()

    const tasksByStatus = tasksResponse.response.data

    return (
        <div>
            <TaskBoard baseUrl={dashboardUrl} initialTasks={tasksByStatus} projectId={parseInt(projectId)} />
        </div>
    )
}
