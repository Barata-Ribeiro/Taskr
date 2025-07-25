"use client"

import { Activity } from "@/@types/activity"
import { ProblemDetails } from "@/@types/application"
import getProjectActivities from "@/actions/project/get-project-activities"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import Loading from "@/components/shared/feedback/Loading"
import ProjectActivityBadge from "@/components/shared/project/ProjectActivityBadge"
import ProjectActivityIcon from "@/components/shared/project/ProjectActivityIcon"
import DefaultButton from "@/components/ui/DefaultButton"
import dateFormatter from "@/utils/date-formatter"
import { use, useState, useTransition } from "react"

interface ProjectFeedProps {
    activitiesPromise: ReturnType<typeof getProjectActivities>
    id: number
}

export default function ProjectFeed({ activitiesPromise, id }: Readonly<ProjectFeedProps>) {
    const firstActivities = use(activitiesPromise)
    const [activities, setActivities] = useState<Activity[]>(firstActivities?.response?.data?.content ?? [])
    const [pagination, setPagination] = useState(firstActivities?.response?.data?.page ?? null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    if (!firstActivities?.response?.data) {
        const isProblemDetails = (firstActivities.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (firstActivities.error as ProblemDetails).detail
            : "An error occurred while fetching the project activities."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const hasMore = pagination && (pagination.number + 1) * pagination.size < pagination.totalElements

    const content = firstActivities.response.data.content

    function loadMoreActivities() {
        if (isPending || !hasMore) return

        startTransition(async () => {
            setError(null)

            try {
                const nextPage = pagination.number + 1
                const nextActivities = await getProjectActivities({
                    projectId: id,
                    queryParams: {
                        page: nextPage,
                        perPage: pagination.size,
                        direction: "DESC",
                        orderBy: "createdAt",
                    },
                })

                if (!nextActivities?.response?.data) {
                    const isProblemDetails = (nextActivities.error as ProblemDetails)?.type !== undefined
                    const errorMessage = isProblemDetails
                        ? (nextActivities.error as ProblemDetails).detail
                        : "An error occurred while loading more activities."
                    setError(errorMessage)
                    return
                }

                const newActivities = nextActivities.response.data.content
                setActivities(prevActivities => [...prevActivities, ...newActivities])
                setPagination(nextActivities.response.data.page)
            } catch (e: unknown) {
                const isProblemDetails = (e as ProblemDetails)?.type !== undefined
                const errorMessage = isProblemDetails
                    ? (e as ProblemDetails).detail
                    : "An error occurred while loading more activities."
                setError(errorMessage)
                return
            }
        })
    }

    return (
        <section
            className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800"
            aria-labelledby="project-activities-heading"
            tabIndex={-1}>
            <div className="px-4 pt-4 sm:flex-1 sm:px-6 sm:pt-6">
                <h2 id="project-activities-heading" className="text-xl font-semibold" tabIndex={-1}>
                    Feed
                </h2>
                <p className="mt-1 truncate text-gray-500 dark:text-gray-400" id="project-activities-desc">
                    Recent activities in this project
                </p>
            </div>

            <ul
                className="mt-6 border-t border-gray-100 p-4 sm:p-6 dark:border-gray-700"
                aria-labelledby="project-activities-heading"
                aria-describedby="project-activities-desc">
                {activities.map((activity, index) => (
                    <li key={activity.id} className="relative pb-6 last:pb-0">
                        {index !== activities.length - 1 ? (
                            <span
                                aria-hidden
                                className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                            />
                        ) : null}
                        <div className="flex space-x-4">
                            <div className="flex size-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                <ProjectActivityIcon action={activity.action} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium">@{activity.username}</span>
                                    <ProjectActivityBadge action={activity.action} />
                                </div>
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-400">{activity.description}</p>
                                <time
                                    dateTime={activity.createdAt}
                                    className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {dateFormatter(activity.createdAt, { dateStyle: "full" })}
                                </time>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center p-4">
                {error && <DashboardErrorMessage message={error} />}

                {hasMore && (
                    <DefaultButton disabled={isPending} width="fit" onClick={loadMoreActivities}>
                        {isPending ? <Loading /> : "Load more activities"}
                    </DefaultButton>
                )}

                {!hasMore && activities.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No more activities to load.</span>
                )}
            </div>
        </section>
    )
}
