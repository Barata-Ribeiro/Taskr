import { Paginated } from "@/@types/application"
import { Project } from "@/@types/project"
import getAllMyProjectsPaginated from "@/actions/project/get-all-my-projects-paginated"
import getGlobalStats from "@/actions/stats/get-global-stats"
import getUserStats from "@/actions/stats/get-user-stats"
import ProjectStatsList from "@/components/stats/ProjectStatsList"
import { auth } from "auth"
import { redirect } from "next/navigation"

interface StatsPageProps {
    params: Promise<{ username: string }>
}

export default async function StatsPage({ params }: Readonly<StatsPageProps>) {
    const [{ username }, session] = await Promise.all([params, auth()])
    if (!session) redirect("/auth/login")
    if (session.user.username !== username) redirect(`/dashboard/${session.user.username}/reports`)

    // Global Stats
    let globalStatsSection
    if (session.user.role === "ADMIN") {
        const globalStats = await getGlobalStats()
        globalStatsSection = (
            <section className="mb-8">
                <h2 className="mb-2 text-lg font-semibold">Global Statistics</h2>
                {globalStats.ok ? (
                    <pre>{JSON.stringify(globalStats?.response?.data, null, 2)}</pre>
                ) : (
                    <span className="text-red-500">Failed to fetch global statistics.</span>
                )}
            </section>
        )
    } else {
        globalStatsSection = (
            <section className="mb-8">
                <h2 className="mb-2 text-lg font-semibold">Global Statistics</h2>
                <span className="text-gray-500">Global Statistics are not available for members.</span>
            </section>
        )
    }

    // Project Stats
    // Initial fetch for first page
    const initialProjects = await getAllMyProjectsPaginated({
        page: 0,
        perPage: 10,
        direction: "DESC",
        orderBy: "createdAt",
    })

    const pagination = initialProjects?.response?.data as Paginated<Project>
    const projects = pagination.content ?? []

    const totalElements = pagination.page.totalElements ?? 0
    const hasMore = projects.length < totalElements

    // User Stats
    let userStatsSection
    if (session.user.role === "ADMIN") {
        const userStats = await getUserStats(session.user.id)
        userStatsSection = (
            <section className="mb-8">
                <h2 className="mb-2 text-lg font-semibold">User Statistics (Admin)</h2>
                {userStats.ok ? (
                    <pre>{JSON.stringify(userStats.response?.data, null, 2)}</pre>
                ) : (
                    <span className="text-red-500">Failed to fetch your user statistics.</span>
                )}
                <div className="mt-4">
                    <span className="text-gray-500">User selector for stats not available yet.</span>
                </div>
            </section>
        )
    } else {
        const userStats = await getUserStats(session.user.id)
        userStatsSection = (
            <section className="mb-8">
                <h2 className="mb-2 text-lg font-semibold">Your Statistics</h2>
                {userStats.ok ? (
                    <pre>{JSON.stringify(userStats.response?.data, null, 2)}</pre>
                ) : (
                    <span className="text-red-500">Failed to fetch your statistics.</span>
                )}
            </section>
        )
    }

    // Project stats logic (client-side interaction for load more and fetch stats)
    // This is a placeholder for the interactive part, which should be implemented in a client component

    return (
        <section>
            {globalStatsSection}
            <section className="mb-8">
                <h2 className="mb-2 text-lg font-semibold">Project Statistics</h2>
                <ProjectStatsList initialProjects={projects} hasMore={hasMore} />
            </section>
            {userStatsSection}
        </section>
    )
}
