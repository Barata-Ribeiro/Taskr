import getProjectById from "@/actions/project/get-project-by-id"
import ProjectStatusBadge from "@/components/shared/project/ProjectStatusBadge"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import dateFormatter from "@/utils/date-formatter"
import { auth } from "auth"
import { CalendarIcon, MessageSquareIcon, MoveLeftIcon, SquarePenIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Fragment } from "react"

interface ProjectPageProps {
    params: Promise<{ username: string; id: string }>
}

export default async function ProjectPage({ params }: Readonly<ProjectPageProps>) {
    const { username, id } = await params
    if (!username || !id) return notFound()

    const [session, projectResponse] = await Promise.all([auth(), getProjectById(parseInt(id))])
    if (!session) return redirect("/auth/login")
    if (session.user.username !== username) return redirect(`/dashboard/${session.user.username}/projects/${id}`)
    if (!projectResponse?.response?.data) return notFound()

    const baseUrl = `/dashboard/${username}`

    const project = projectResponse.response.data

    return (
        <Fragment>
            <header className="flex items-center justify-between gap-4">
                <Link
                    href={`${baseUrl}/projects`}
                    aria-label="Back to Projects"
                    title="Back to Projects"
                    className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <MoveLeftIcon aria-hidden size={16} /> Back to Projects
                </Link>

                <DefaultLinkButton href={`${baseUrl}/projects/${id}/edit`} width="fit">
                    <SquarePenIcon aria-hidden size={16} /> Edit Project
                </DefaultLinkButton>
            </header>

            <section className="space-y-6 overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800">
                <div className="sm:flex sm:items-baseline sm:justify-between">
                    <div className="sm:w-0 sm:flex-1">
                        <h1 id="message-heading" className="text-xl font-semibold">
                            {project.title}
                        </h1>
                        <p className="mt-1 truncate text-gray-500 dark:text-gray-400">{project.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:shrink-0 sm:justify-start">
                        <ProjectStatusBadge status={project.status} type="text" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon size={16} aria-hidden />
                        <div>
                            <p className="text-sm font-medium">Due Date</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{dateFormatter(project.dueDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MessageSquareIcon size={16} aria-hidden />
                        <div>
                            <p className="text-sm font-medium">Total Tasks</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{project.totalTasks}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UsersIcon size={16} aria-hidden />
                        <div>
                            <p className="text-sm font-medium">Team Members</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{project.memberships.length}</p>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}
