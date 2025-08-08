import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function ProjectStatsSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="mt-4 md:mt-6">
            <DefaultSkeleton className="mb-4 h-7 w-48" />

            {/* Proper Project Stats display skeleton */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center rounded-lg bg-gray-100 p-4 shadow-sm transition hover:scale-[1.03] dark:bg-gray-800">
                        <DefaultSkeleton className="mr-4 size-8 rounded-full" />
                        <div>
                            <DefaultSkeleton className="mb-2 h-4 w-32" />
                            <DefaultSkeleton className="h-7 w-24" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Other Project Stats display skeleton */}
            <div className="mt-8">
                <DefaultSkeleton className="mb-4 h-7 w-48" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center rounded-lg bg-gray-100 p-4 shadow-sm transition hover:scale-[1.03] dark:bg-gray-800">
                            <DefaultSkeleton className="mr-4 h-8 w-8 rounded-full" />
                            <div>
                                <DefaultSkeleton className="mb-2 h-4 w-20" />
                                <DefaultSkeleton className="h-7 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
