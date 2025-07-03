import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function ProjectFeedSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <div className="px-4 pt-4 sm:flex-1 sm:px-6 sm:pt-6">
                <DefaultSkeleton className="mb-2 h-6 w-24" />
                <DefaultSkeleton className="h-4 w-48" />
            </div>
            <div role="list" className="mt-6 border-t border-gray-100 p-4 sm:p-6 dark:border-gray-700">
                {[...Array(3)].map((_, i) => (
                    <div role="listitem" key={i} className="relative pb-6 last:pb-0">
                        {i !== 2 && (
                            <span
                                aria-hidden
                                className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                            />
                        )}
                        <div className="flex space-x-4">
                            <div className="flex size-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                <DefaultSkeleton className="size-4 rounded" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <DefaultSkeleton className="h-4 w-20" />
                                    <DefaultSkeleton className="h-4 w-16" />
                                </div>
                                <DefaultSkeleton className="mt-2 h-4 w-40" />
                                <DefaultSkeleton className="mt-2 h-3 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
