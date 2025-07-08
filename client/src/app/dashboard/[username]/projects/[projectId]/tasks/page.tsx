import { Task } from "@/@types/task"
import getTasksByProjectId from "@/actions/task/get-tasks-by-project-id"
import statusStringNormalizer from "@/utils/status-string-normalizer"
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

    const baseUrl = `/dashboard/${session.user.username}/projects/${projectId}`
    if (session.user.username !== username) return redirect(`${baseUrl}/tasks`)

    const tasksResponse = await getTasksByProjectId(parseInt(projectId))
    if (!tasksResponse.ok || !tasksResponse.response?.data) return notFound()

    const tasksByStatus = tasksResponse.response.data

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
                <div key={status} className="rounded bg-white p-4 shadow">
                    <h2 className="mb-2 text-lg font-semibold capitalize">{statusStringNormalizer(status)}</h2>

                    {tasks.length > 0 ? (
                        <ul className="space-y-2">
                            {tasks.map((task: Task) => (
                                <li key={task.id} className="rounded border p-2 hover:bg-gray-50">
                                    <h3 className="font-medium">{task.title}</h3>
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No tasks in this status.</p>
                    )}
                </div>
            ))}
        </div>
    )
}
