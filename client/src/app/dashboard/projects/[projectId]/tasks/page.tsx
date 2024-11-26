import getAllTasksByProjectId from "@/actions/tasks/get-all-tasks-by-project-id"
import getUserContext from "@/actions/user/get-user-context"
import StateError from "@/components/feedback/state-error"
import StackedTasks from "@/components/lists/stacked-tasks"
import { ProblemDetails } from "@/interfaces/actions"
import { ProjectSortedTasks } from "@/interfaces/task"
import { UserContext } from "@/interfaces/user"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

interface TasksPageProps {
    params: {
        projectId: string
    }
}

export const metadata: Metadata = {
    title: "Project Tasks",
    description: "Listing all tasks within the requested project.",
}

export default async function TasksPage({ params }: TasksPageProps) {
    if (!params) return notFound()

    const contextStatePromise = getUserContext()
    const tasksStatePromise = getAllTasksByProjectId({ projectId: +params.projectId })

    const [contextState, tasksState] = await Promise.all([contextStatePromise, tasksStatePromise])
    if (contextState.error || tasksState.error) {
        const error = contextState.error || tasksState.error
        return <StateError error={error as ProblemDetails} />
    }

    const context = contextState.response?.data as UserContext
    const tasksData = tasksState.response?.data as ProjectSortedTasks

    if (context.projectsWhereUserIsMember.find(project => project.id !== tasksData.project.id))
        return redirect("/dashboard")

    return (
        <section id="listing-project-tasks-section" aria-labelledby="listing-project-tasks-section-title">
            <header className="mx-auto mb-4 max-w-2xl border-b border-gray-200 pb-4 lg:mx-0">
                <h1
                    id="listing-project-tasks-section-title"
                    className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    &apos;{tasksData.project.name}&apos; Tasks
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Listing all tasks for the project <strong>{tasksData.project.name}</strong>.
                </p>
            </header>

            <div className="rounded-lg bg-white p-4 shadow-derek">
                <StackedTasks tasks={tasksData.tasks} />
            </div>
        </section>
    )
}
