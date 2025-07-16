import { GlobalStats } from "@/@types/stats"

interface OtherStatisticsProps {
    data: GlobalStats
}

export default function OtherStatistics({ data }: Readonly<OtherStatisticsProps>) {
    const otherStats = Object.entries(data).filter(([key]) => key !== "userCount" && key !== "projectsCount")

    return (
        <div
            aria-labelledby="other-statistics-title"
            aria-label="Other statistics"
            className="mt-4 md:mt-6"
            role="region">
            <h3 id="other-statistics-title" className="text-base font-semibold text-gray-900">
                Other Statistics
            </h3>

            <div
                className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4"
                role="list"
                aria-label="List of other statistics">
                {otherStats.map(([key, value]: [string, number]) => (
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
    )
}
