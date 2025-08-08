import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"
import ProjectStatsSkeleton from "@/components/ui/skeletons/ProjectStatsSkeleton"

export default function ProjectStatsListSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait.">
            {/* Heading and description */}
            <DefaultSkeleton className="mb-2 h-7 w-48" />
            <DefaultSkeleton className="mb-6 h-4 w-96" />

            {/* Project cards skeleton */}
            <DefaultSkeleton className="mb-4 h-5 w-32" />

            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <li key={i} className="col-span-1 flex rounded-md shadow-xs">
                        <DefaultSkeleton className="flex h-auto w-16 rounded-none! rounded-l-md!" />
                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex-1 truncate px-4 py-2">
                                <DefaultSkeleton className="mb-1 h-5 w-24" />
                                <DefaultSkeleton className="h-4 w-20" />
                            </div>
                            <div className="shrink-0 pr-2">
                                <DefaultSkeleton className="size-8 rounded-md" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <ProjectStatsSkeleton />
        </div>
    )
}
