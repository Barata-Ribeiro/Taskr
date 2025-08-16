import { ProblemDetails } from "@/@types/application"
import { ProjectRole } from "@/@types/project"
import adminGetAllProjectsPaginated from "@/actions/admin/admin-get-all-projects-paginated"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import ProjectRoleBadge from "@/components/shared/project/ProjectRoleBadge"
import ProjectStatusBadge from "@/components/shared/project/ProjectStatusBadge"
import DueDateBadge from "@/components/shared/task/DueDateBadge"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import dateFormatter from "@/utils/date-formatter"
import { EyeIcon } from "lucide-react"
import { Session } from "next-auth"
import Link from "next/link"

interface LatestProjectsProps {
    session: Session | null
}

export default async function LatestProjects({ session }: Readonly<LatestProjectsProps>) {
    if (!session) return null

    const state = await adminGetAllProjectsPaginated({ page: 0, perPage: 10, direction: "DESC", orderBy: "createdAt" })

    if (!state.ok || !state.response?.data) {
        const isProblemDetails = (state.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (state.error as ProblemDetails).detail
            : "An error occurred while fetching the projects."
        return <DashboardErrorMessage message={errorMessage} />
    }
    const baseUrl = `/dashboard/${session.user.username}`

    const pagination = state.response?.data
    const content = pagination.content ?? []

    return (
        <section aria-labelledby="latest-projects-section-title" className="mt-8">
            <header className="mb-4 border-b border-gray-200 pb-5 max-sm:space-y-2 sm:flex sm:items-center sm:justify-between dark:border-gray-700">
                <h2 id="latest-projects-section-title" className="text-2xl font-bold">
                    Latest Projects
                </h2>
                <DefaultLinkButton buttonType="color" width="fit" href={`${baseUrl}/admin/projects`}>
                    View All
                </DefaultLinkButton>
            </header>

            <ul
                className="divide-y divide-gray-100 overflow-hidden bg-white shadow-xs ring-1 ring-gray-200 sm:rounded-xl dark:bg-gray-800 dark:ring-gray-700"
                aria-label="List of latest projects">
                {content.map(project => {
                    const profileUrl = `${baseUrl}/profile/${project.owner.username}`
                    const profileLabel = `View profile of ${project.owner.username}`

                    const projectUrl = `${baseUrl}/projects/${project.id}`
                    const projectLabel = `View project ${project.title}`

                    const isCurrentUser = session.user.username === project.owner.username

                    return (
                        <li
                            key={project.id}
                            className="group relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8 dark:hover:bg-gray-700">
                            <div className="inline-flex min-w-0 items-center gap-x-4">
                                <div className="min-w-0 flex-auto">
                                    <Link
                                        href={projectUrl}
                                        className="text-base/6 font-semibold text-indigo-600 select-none hover:text-indigo-500 hover:underline active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500"
                                        aria-label={projectLabel}>
                                        {project.title}
                                    </Link>
                                    <div className="mt-1 flex flex-col items-start gap-x-2 divide-gray-200 sm:flex-row sm:items-center sm:divide-x dark:divide-gray-700">
                                        <Link
                                            href={profileUrl}
                                            className="pr-2 text-xs/5 text-gray-500 select-none dark:text-gray-400"
                                            aria-label={profileLabel}>
                                            {project.owner.displayName}{" "}
                                            {isCurrentUser && <span className="text-xs text-indigo-500">(You)</span>}
                                        </Link>

                                        <ProjectRoleBadge role={ProjectRole.OWNER} />
                                    </div>
                                </div>
                            </div>
                            <div className="inline-flex shrink-0 items-center gap-x-4">
                                <div className="hidden gap-1 sm:flex sm:flex-col sm:items-end">
                                    <time
                                        className="text-xs/5 text-gray-500 dark:text-gray-400"
                                        dateTime={project.createdAt.toString()}
                                        aria-label={`Created on ${dateFormatter(project.createdAt)}`}>
                                        {dateFormatter(project.createdAt)}
                                    </time>

                                    <ProjectStatusBadge status={project.status} type="text" />

                                    <DueDateBadge date={project.dueDate} />
                                </div>

                                <DefaultLinkButton
                                    href={projectUrl}
                                    buttonType="ghost"
                                    width="fit"
                                    isIconOnly
                                    aria-label={projectLabel}
                                    title={projectLabel}>
                                    <EyeIcon
                                        aria-hidden
                                        size={18}
                                        className="shrink-0 text-gray-500 dark:text-gray-400"
                                    />
                                </DefaultLinkButton>
                            </div>
                        </li>
                    )
                })}
                {content.length === 0 && (
                    <li className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                        No projects found.
                    </li>
                )}
            </ul>
        </section>
    )
}
