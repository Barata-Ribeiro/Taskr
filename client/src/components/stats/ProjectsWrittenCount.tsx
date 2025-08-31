import { ProjectsCount } from "@/@types/stats"

interface ProjectsWrittenCountProps {
    data: ProjectsCount
}

export default function ProjectsWrittenCount({ data }: Readonly<ProjectsWrittenCountProps>) {
    const { totalProjects, totalProjectsLast7Days, totalProjectsLast30Days, ...rest } = data

    const percent7 = totalProjects ? ((totalProjectsLast7Days / totalProjects) * 100).toFixed(1) : "0"
    const percent30 = totalProjects ? ((totalProjectsLast30Days / totalProjects) * 100).toFixed(1) : "0"

    return (
        <div
            className="col-span-2 rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800"
            role="region"
            aria-labelledby="projects-stats-heading">
            <h3 id="projects-stats-heading" className="me-1 text-xl leading-none font-semibold">
                Projects Statics
            </h3>
            <small
                className="mb-4 block border-b border-gray-200 pb-2 text-gray-500 md:mb-6 dark:border-gray-700 dark:text-gray-400"
                aria-live="polite">
                {totalProjects} project(s) in total
            </small>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <dl className="grid items-start gap-2">
                    <dt className="font-medium text-blue-500 dark:text-blue-400" aria-label="Last 7 days">
                        Last 7 days
                    </dt>
                    <dd
                        className="text-sm font-semibold text-blue-600 dark:text-blue-300"
                        aria-label={`${totalProjectsLast7Days} projects`}>
                        {totalProjectsLast7Days} projects
                        <span className="ml-2 text-xs font-normal text-blue-400 dark:text-blue-200">({percent7}%)</span>
                    </dd>
                </dl>

                <dl className="grid items-start gap-2">
                    <dt className="font-medium text-green-500 dark:text-green-400" aria-label="Last 30 days">
                        Last 30 days
                    </dt>
                    <dd
                        className="text-sm font-semibold text-green-600 dark:text-green-300"
                        aria-label={`${totalProjectsLast30Days} projects`}>
                        {totalProjectsLast30Days} projects
                        <span className="ml-2 text-xs font-normal text-green-400 dark:text-green-200">
                            ({percent30}%)
                        </span>
                    </dd>
                </dl>

                {Object.entries(rest).map(([key, value]) => {
                    const formattedKey = key
                        .replace(/total/gi, "")
                        .replace(/Status/gi, "")
                        .replace(/([A-Z])/g, " $1")
                        .replace(/Overdue/gi, "Overdue")
                        .trim()

                    return (
                        <dl key={key} className="grid items-start gap-2">
                            <dt
                                className="font-medium text-gray-500 dark:text-gray-400"
                                aria-label={`Metric: ${formattedKey}`}>
                                {formattedKey}
                            </dt>
                            <dd className="text-sm font-semibold" aria-label={`${value} projects`}>
                                {value} projects
                            </dd>
                        </dl>
                    )
                })}
            </div>
        </div>
    )
}
