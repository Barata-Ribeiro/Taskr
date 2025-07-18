"use client"

import { ProblemDetails, QueryParams } from "@/@types/application"
import { ProjectStats } from "@/@types/stats"
import getAllMyProjectsPaginated from "@/actions/project/get-all-my-projects-paginated"
import getProjectStats from "@/actions/stats/get-project-stats"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import getFallbackInitials from "@/utils/get-fallback-initials"
import tw from "@/utils/tw"
import { Button } from "@headlessui/react"
import { ChevronsRightIcon } from "lucide-react"
import { use, useState, useTransition } from "react"
import { twMerge } from "tailwind-merge"

interface ProjectStatsListProps {
    projectsPromise: ReturnType<typeof getAllMyProjectsPaginated>
    baseUrl: string
}

export default function ProjectStatsList({ projectsPromise, baseUrl }: Readonly<ProjectStatsListProps>) {
    const initialProjects = use(projectsPromise)
    const [projects, setProjects] = useState(initialProjects?.response?.data?.content ?? [])
    const [pagination, setPagination] = useState(initialProjects?.response?.data?.page ?? null)
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
    const [projectStats, setProjectStats] = useState<ProjectStats | null>(null)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    if (!initialProjects?.response?.data) {
        const isProblemDetails = (initialProjects.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (initialProjects.error as ProblemDetails).detail
            : "An error occurred while loading your projects."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const hasMore = pagination && (pagination.number + 1) * pagination.size < pagination.totalElements

    function loadMoreProjects() {
        if (isPending || !hasMore) return

        startTransition(async () => {
            setError(null)

            try {
                const nextPage = pagination.number + 1
                const queryParams: QueryParams = {
                    page: nextPage,
                    perPage: pagination.size,
                    direction: "DESC",
                    orderBy: "createdAt",
                }
                const nextProjects = await getAllMyProjectsPaginated(queryParams)

                if (!nextProjects?.response?.data) {
                    const isProblemDetails = (nextProjects.error as ProblemDetails)?.type !== undefined
                    const errorMessage = isProblemDetails
                        ? (nextProjects.error as ProblemDetails).detail
                        : "An error occurred while loading more projects."
                    setError(errorMessage)
                    return
                }

                const newProjects = nextProjects.response.data.content
                setProjects(prev => [...prev, ...newProjects])
                setPagination(nextProjects.response.data.page)
                setSelectedProjectId(null)
                setProjectStats(null)
            } catch (e: unknown) {
                const isProblemDetails = (e as ProblemDetails)?.type !== undefined
                const errorMessage = isProblemDetails
                    ? (e as ProblemDetails).detail
                    : "An error occurred while loading your projects."
                setError(errorMessage)
                return
            }
        })
    }

    function loadProjectStats(projectId: number) {
        if (isPending) return

        startTransition(async () => {
            setSelectedProjectId(projectId)
            setProjectStats(null)

            try {
                const stats = await getProjectStats(projectId)

                if (!stats.ok || !stats.response?.data) {
                    const isProblemDetails = (stats.error as ProblemDetails)?.type !== undefined
                    const errorMessage = isProblemDetails
                        ? (stats.error as ProblemDetails).detail
                        : "Failed to fetch project stats."
                    setError(errorMessage)
                    return
                }

                setProjectStats(stats.response.data)
            } catch (e: unknown) {
                const isProblemDetails = (e as ProblemDetails)?.type !== undefined
                const errorMessage = isProblemDetails
                    ? (e as ProblemDetails).detail
                    : "An error occurred while fetching project stats."
                setError(errorMessage)
            }
        })
    }

    const projectDefaultStyles = tw`flex h-auto w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium select-none`

    const statusColor = {
        NOT_STARTED: "bg-gray-500 text-gray-200",
        IN_PROGRESS: "bg-blue-500 text-blue-800 dark:bg-blue-600 dark:text-blue-200",
        COMPLETED: "bg-green-500 text-green-800 dark:bg-green-600 dark:text-green-200",
        ON_HOLD: "bg-yellow-500 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200",
        CANCELLED: "bg-red-500 text-red-800 dark:bg-red-600 dark:text-red-200",
    }

    // TODO: Add loading state for stats fetch with a skeleton
    // TODO: Create a component for displaying project stats

    return (
        <section aria-labelledby="project-stats-heading" aria-describedby="project-stats-description">
            <h2 id="project-stats-heading" className="text-2xl/7 font-bold">
                Projects Statistics
            </h2>
            <p id="project-stats-description" className="mt-2 max-w-4xl text-sm text-gray-500 dark:text-gray-400">
                Display statistics for projects you own or contribute to. Click on a project to view detailed stats.
            </p>

            <div className="mt-6">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</h2>
                <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {projects.map(project => {
                        const projectInitials = getFallbackInitials(project.title)
                        const projectUrl = `${baseUrl}/${project.id}`
                        const projectLabel = `Go to '${project.title}' project page`
                        const loadStatsLabel = `View stats for project '${project.title}'`
                        const projectBackgroundColor = statusColor[project.status]
                        const mergedClasses = twMerge(projectDefaultStyles, projectBackgroundColor)

                        return (
                            <li key={project.id} className="col-span-1 flex rounded-md shadow-xs">
                                <div className={mergedClasses}>{projectInitials}</div>
                                <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex-1 truncate px-4 py-2 text-sm">
                                        <Button
                                            type="button"
                                            onClick={() => loadProjectStats(project.id)}
                                            aria-label={loadStatsLabel}
                                            title={loadStatsLabel}
                                            className="cursor-pointer text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 disabled:pointer-events-none disabled:grayscale-100 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                                            {project.title}
                                        </Button>

                                        <p className="text-gray-500 dark:text-gray-400">By @{project.owner.username}</p>
                                    </div>
                                    <div className="shrink-0 pr-2">
                                        <DefaultLinkButton
                                            href={projectUrl}
                                            buttonType="ghost"
                                            width="fit"
                                            isIconOnly
                                            aria-label={projectLabel}
                                            title={projectLabel}>
                                            <ChevronsRightIcon aria-hidden className="size-5 text-inherit" />
                                        </DefaultLinkButton>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="flex justify-center p-4">
                {error && <DashboardErrorMessage message={error} />}

                {hasMore && (
                    <DefaultButton disabled={isPending} width="fit" onClick={loadMoreProjects}>
                        {isPending ? <Loading /> : "Load more projects"}
                    </DefaultButton>
                )}

                {!hasMore && projects.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No more projects to load.</span>
                )}
            </div>

            {selectedProjectId && projectStats && (
                <div className="mt-4 md:mt-6">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Stats</h2>
                    <pre>{JSON.stringify(projectStats, null, 2)}</pre>

                    <div
                        aria-labelledby="other-project-statistics-title"
                        aria-label="Other Project statistics"
                        className="mt-4 md:mt-6"
                        role="region">
                        <h3 id="other-project-statistics-title" className="text-base font-semibold text-gray-900">
                            Other Statistics
                        </h3>

                        <div
                            className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4"
                            role="list"
                            aria-label="List of other project statistics">
                            {Object.entries(projectStats)
                                .filter(([key]) => key.startsWith("tasks") && key === "totalTasks")
                                .map(([key, value]: [string, number]) => (
                                    <dl
                                        key={key}
                                        className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800"
                                        role="listitem"
                                        aria-labelledby={`stat-title-${key}`}>
                                        <dt
                                            className="text-sm font-medium text-gray-500 capitalize dark:text-gray-400"
                                            id={`stat-title-${key}`}>
                                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                        </dt>

                                        <dd className="mt-1 text-3xl font-semibold tracking-tight">{value}</dd>
                                    </dl>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
