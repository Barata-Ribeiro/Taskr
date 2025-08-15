"use client"

import { ProblemDetails, QueryParams } from "@/@types/application"
import { ProjectStats } from "@/@types/stats"
import getAllMyProjectsPaginated from "@/actions/project/get-all-my-projects-paginated"
import getProjectStats from "@/actions/stats/get-project-stats"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import ProjectStatsSkeleton from "@/components/ui/skeletons/ProjectStatsSkeleton"
import getFallbackInitials from "@/utils/get-fallback-initials"
import tw from "@/utils/tw"
import {
    ActivityIcon,
    AlertTriangleIcon,
    CheckCircle2Icon,
    ChevronsRightIcon,
    ClipboardListIcon,
    ClockIcon,
    ListChecksIcon,
    MessageSquareIcon,
    UsersIcon,
} from "lucide-react"
import Link from "next/link"
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
    const [isProjectsPending, startProjectTransition] = useTransition()
    const [isStatsPending, startStatsTransition] = useTransition()
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
        if (isProjectsPending || !hasMore) return

        startProjectTransition(async () => {
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
        if (isStatsPending) return

        startStatsTransition(async () => {
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

    const properStatsConfig = [
        {
            key: "totalComments",
            label: "Comments",
            icon: <MessageSquareIcon aria-hidden size={24} className="text-blue-500" />,
            bg: "bg-blue-50 dark:bg-blue-900",
        },
        {
            key: "totalMembers",
            label: "Members",
            icon: <UsersIcon aria-hidden size={24} className="text-green-500" />,
            bg: "bg-green-50 dark:bg-green-900",
        },
        {
            key: "totalActivities",
            label: "Activities",
            icon: <ActivityIcon aria-hidden size={24} className="text-purple-500" />,
            bg: "bg-purple-50 dark:bg-purple-900",
        },
    ]

    const otherStatsConfig = [
        {
            key: "totalTasks",
            label: "Total Tasks",
            icon: <ClipboardListIcon aria-hidden size={24} className="text-indigo-500" />,
            bg: "bg-indigo-50 dark:bg-indigo-900",
        },
        {
            key: "tasksToDo",
            label: "Tasks To Do",
            icon: <ListChecksIcon aria-hidden size={24} className="text-gray-500" />,
            bg: "bg-gray-50 dark:bg-gray-800",
        },
        {
            key: "tasksInProgress",
            label: "In Progress",
            icon: <ClockIcon aria-hidden size={24} className="text-yellow-500" />,
            bg: "bg-yellow-50 dark:bg-yellow-900",
        },
        {
            key: "tasksDone",
            label: "Done",
            icon: <CheckCircle2Icon aria-hidden size={24} className="text-green-500" />,
            bg: "bg-green-50 dark:bg-green-900",
        },
        {
            key: "totalOverdueTasks",
            label: "Overdue",
            icon: <AlertTriangleIcon aria-hidden size={24} className="text-red-500" />,
            bg: "bg-red-50 dark:bg-red-900",
        },
    ]

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
                                        <Link
                                            href={projectUrl}
                                            aria-label={projectLabel}
                                            title={projectLabel}
                                            className="cursor-pointer text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 disabled:pointer-events-none disabled:grayscale-100 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                                            {project.title}
                                        </Link>

                                        <p className="text-gray-500 dark:text-gray-400">By @{project.owner.username}</p>
                                    </div>
                                    <div className="shrink-0 pr-2">
                                        <DefaultButton
                                            onClick={() => loadProjectStats(project.id)}
                                            buttonType="ghost"
                                            width="fit"
                                            isIconOnly
                                            aria-label={loadStatsLabel}
                                            title={loadStatsLabel}>
                                            <ChevronsRightIcon aria-hidden className="size-5 text-inherit" />
                                        </DefaultButton>
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
                    <DefaultButton disabled={isProjectsPending} width="fit" onClick={loadMoreProjects}>
                        {isProjectsPending ? <Loading /> : "Load more projects"}
                    </DefaultButton>
                )}

                {!hasMore && projects.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No more projects to load.</span>
                )}
            </div>

            {isStatsPending && <ProjectStatsSkeleton />}
            {selectedProjectId && projectStats && (
                <div className="mt-4 md:mt-6">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Stats</h2>

                    {/* Proper Project Stats display */}
                    <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {properStatsConfig.map(stat => (
                            <div
                                key={stat.key}
                                className={`flex items-center rounded-lg p-4 shadow-sm ${stat.bg} transition hover:scale-[1.03]`}
                                title={stat.label}>
                                <div className="mr-4">{stat.icon}</div>
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {projectStats[stat.key as keyof typeof projectStats]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Other Project Stats display */}
                    <div
                        aria-labelledby="other-project-statistics-title"
                        aria-label="Other Project statistics"
                        className="mt-8"
                        role="region">
                        <h3
                            id="other-project-statistics-title"
                            className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                            Other Statistics
                        </h3>

                        <div
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                            role="list"
                            aria-label="List of other project statistics">
                            {otherStatsConfig.map(stat => (
                                <div
                                    key={stat.key}
                                    className={`flex items-center rounded-lg p-4 shadow-sm ${stat.bg} transition hover:scale-[1.03]`}
                                    title={stat.label}>
                                    <div className="mr-4">{stat.icon}</div>
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                            {stat.label}
                                        </div>
                                        <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {projectStats[stat.key as keyof typeof projectStats]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
