import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function LatestUsersSkeleton() {
    return (
        <div role="status" aria-label="Loading latest users... Please wait.">
            <div className="mb-4 border-b border-gray-200 pb-5 max-sm:space-y-2 sm:flex sm:items-center sm:justify-between dark:border-gray-700">
                <DefaultSkeleton className="h-8 w-40" />
                <DefaultSkeleton className="h-10 w-24" />
            </div>
            <ul
                className="divide-y divide-gray-100 overflow-hidden bg-white shadow-xs ring-1 ring-gray-200 sm:rounded-xl dark:divide-gray-700 dark:bg-gray-800 dark:ring-gray-700"
                aria-label="List of latest users skeleton">
                {[...Array(10)].map((_, i) => (
                    <li
                        key={i}
                        className="group relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8 dark:hover:bg-gray-700">
                        <div className="inline-flex min-w-0 items-center gap-x-4">
                            <DefaultSkeleton className="h-8 w-8 rounded-full" />
                            <div className="min-w-0 flex-auto">
                                <DefaultSkeleton className="mb-1 h-5 w-32" />
                                <DefaultSkeleton className="h-4 w-40" />
                            </div>
                        </div>
                        <div className="inline-flex shrink-0 items-center gap-x-4">
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                                <DefaultSkeleton className="mb-1 h-5 w-16" />
                                <DefaultSkeleton className="h-4 w-24" />
                            </div>
                            <DefaultSkeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
