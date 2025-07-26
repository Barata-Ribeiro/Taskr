import getTaskById from "@/actions/task/get-task-by-id"
import TaskDetails from "@/components/task/TaskDetails"
import { auth } from "auth"
import { MoveLeftIcon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

interface TaskPageProps {
    params: Promise<{ username: string; projectId: string; taskId: string }>
}

export async function generateMetadata({ params }: Readonly<TaskPageProps>): Promise<Metadata> {
    const { username, projectId, taskId } = await params

    const taskResponse = await getTaskById(parseInt(projectId), parseInt(taskId))
    if (!taskResponse.ok || !taskResponse.response?.data) return notFound()

    const task = taskResponse.response.data

    return {
        title: `Task Details - ${task.title}`,
        description: `View details for task "${task.title}" in project "${projectId}" by user "${username}".`,
        openGraph: {
            title: `Task Details - ${task.title}`,
            description: `View details for task "${task.title}" in project "${projectId}" by user "${username}".`,
            url: `/dashboard/${username}/projects/${projectId}/tasks/${taskId}`,
            type: "article",
        },
    }
}

export default async function TaskPage({ params }: Readonly<TaskPageProps>) {
    const [{ username, projectId, taskId }, session] = await Promise.all([params, auth()])
    if (!username || !projectId) return notFound()

    if (!session) return redirect("/auth/login")
    if (session.user.username !== username) {
        return redirect(`/dashboard/${session.user.username}/projects/${projectId}/tasks/${taskId}`)
    }

    const baseUrl = `/dashboard/${username}`
    const taskBoardUrl = `${baseUrl}/projects/${projectId}/tasks`

    return (
        <section aria-labelledby="task-details-heading" aria-describedby="task-details-description">
            <header className="grid gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
                <Link
                    href={taskBoardUrl}
                    aria-label="Back to Task Board"
                    title="Back to Task Board"
                    className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <MoveLeftIcon aria-hidden="true" size={16} /> <span>Back to Task Board</span>
                </Link>

                <div className="grid gap-2">
                    <h2 id="task-details-heading" className="text-2xl font-semibold">
                        Task Details
                    </h2>

                    <p id="task-details-description" className="text-sm text-gray-500 dark:text-gray-400">
                        View and manage the details of your task. You can edit, assign, or update the status of the task
                        as needed. Assignees can comment and collaborate on the task directly from this page.
                    </p>
                </div>
            </header>

            <div className="mt-4 grid h-full grid-cols-1 gap-6 sm:grid-cols-2">
                <Suspense fallback="Loading...">
                    <TaskDetails baseUrl={baseUrl} projectId={parseInt(projectId)} taskId={parseInt(taskId)} />
                </Suspense>

                <div className="block rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    {/*TODO: Implement Task comments*/}
                </div>
            </div>
        </section>
    )
}
