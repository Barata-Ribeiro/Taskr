"use client"

import { ProjectsCount } from "@/@types/stats"
import { VictoryBar, VictoryChart, VictoryTheme } from "victory"

interface ProjectsByStatusProps {
    data: ProjectsCount
}

export default function ProjectsByStatus({ data }: Readonly<ProjectsByStatusProps>) {
    const projectsByStatus: { x: string; y: number }[] = Object.entries(data)
        .filter(([key, value]) => key.startsWith("totalStatus") && value !== 0)
        .map(([key, value]) => ({
            x: key
                .replace("totalStatus", "")
                .replace(/([A-Z])/g, " $1")
                .trim(),
            y: value as number,
        }))

    return (
        <div
            className="rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800"
            role="region"
            aria-labelledby="projects-by-status-title">
            <h3 id="projects-by-status-title" className="me-1 text-xl leading-none font-semibold">
                Projects By Status
            </h3>
            <small
                className="mb-4 block border-b border-gray-200 pb-2 text-gray-500 md:mb-6 dark:border-gray-700 dark:text-gray-400"
                id="projects-by-status-desc">
                Distribution of projects by status
            </small>

            <div className="rounded-lg bg-transparent dark:bg-gray-200">
                <VictoryChart width={350} theme={VictoryTheme.clean}>
                    <VictoryBar data={projectsByStatus} />
                </VictoryChart>
            </div>
        </div>
    )
}
