"use client"

import { Project } from "@/@types/project"
import { ProjectStats } from "@/@types/stats"
import getAllMyProjectsPaginated from "@/actions/project/get-all-my-projects-paginated"
import getProjectStats from "@/actions/stats/get-project-stats"
import { useState } from "react"

export default function ProjectStatsList({
    initialProjects,
    hasMore,
}: Readonly<{
    initialProjects: Project[]
    hasMore: boolean
}>) {
    const [projects, setProjects] = useState<Project[]>(initialProjects)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
    const [projectStats, setProjectStats] = useState<ProjectStats | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function loadMore() {
        setLoading(true)
        const next = await getAllMyProjectsPaginated({ page, perPage: 10, direction: "DESC", orderBy: "createdAt" })
        setProjects(prev => [...prev, ...(next.response?.data?.content ?? [])])
        setPage(p => p + 1)
        setLoading(false)
    }

    async function fetchStats(projectId: number) {
        setSelectedProjectId(projectId)
        setProjectStats(null)
        const stats = await getProjectStats(projectId)
        if (stats.ok && stats.response?.data) setProjectStats(stats.response.data)
        else setError("Failed to fetch project stats.")
    }

    return (
        <div>
            <ul className="mb-4">
                {projects.map(project => (
                    <li key={project.id} className="mb-2">
                        <button className="text-indigo-600 hover:underline" onClick={() => fetchStats(project.id)}>
                            {project.title}
                        </button>
                    </li>
                ))}
            </ul>

            {hasMore && (
                <button className="rounded bg-gray-200 px-4 py-2" onClick={loadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                </button>
            )}

            {error && <div className="mt-2 text-red-500">{error}</div>}

            {/* Display selected project stats */}
            {selectedProjectId && (
                <div className="mt-4">
                    <h3 className="font-semibold">Stats for Project ID: {selectedProjectId}</h3>
                    <pre>{JSON.stringify(projectStats, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
