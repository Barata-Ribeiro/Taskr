import getTasksByProjectId from "@/actions/task/get-tasks-by-project-id"
import NewTaskModal from "@/components/modals/NewTaskModal"
import TaskBoard from "@/components/task/TaskBoard"
import { auth } from "auth"
import { MoveLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Fragment } from "react"

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
        <Fragment>
            <header className="grid gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
                <Link
                    href={baseUrl}
                    aria-label="Back to Project"
                    title="Back to Project"
                    className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <MoveLeftIcon aria-hidden size={16} /> Back to Project
                </Link>

                <div className="grid gap-2">
                    <div className="flex flex-wrap items-center justify-between">
                        <h1 className="text-2xl font-semibold">Task Board</h1>
                        <NewTaskModal projectId={parseInt(projectId)} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage the tasks for this project. You can drag and drop tasks between columns to update their
                        status.
                    </p>
                </div>
            </header>
            <TaskBoard baseUrl={dashboardUrl} initialTasks={tasksByStatus} projectId={parseInt(projectId)} />
        </Fragment>
    )
}
