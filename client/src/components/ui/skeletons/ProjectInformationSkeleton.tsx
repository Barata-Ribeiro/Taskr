import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function ProjectInformationSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="space-y-6 overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800">
            <div className="sm:flex sm:items-baseline sm:justify-between">
                <div className="sm:w-0 sm:flex-1">
                    <DefaultSkeleton className="mb-2 h-6 w-40" />
                    <DefaultSkeleton className="h-4 w-64" />
                </div>
                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:shrink-0 sm:justify-start">
                    <DefaultSkeleton className="h-6 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <DefaultSkeleton className="h-4 w-4 rounded" />
                        <div>
                            <DefaultSkeleton className="mb-1 h-4 w-20" />
                            <DefaultSkeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
