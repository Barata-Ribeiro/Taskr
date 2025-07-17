import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function GlobalStatsSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait.">
            <DefaultSkeleton className="mb-2 h-8 w-48" />
            <DefaultSkeleton className="mb-6 h-5 w-96" />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
                <div className="flex flex-col items-start rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800">
                    <DefaultSkeleton className="mb-2 h-6 w-32" />
                    <DefaultSkeleton className="mb-4 h-4 w-40" />
                    <div className="relative flex w-full items-center justify-center">
                        <DefaultSkeleton className="mx-auto h-[180px] w-[180px] rounded-full" />
                        <DefaultSkeleton className="absolute top-1/2 left-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800">
                    <DefaultSkeleton className="mb-2 h-6 w-32" />
                    <DefaultSkeleton className="mb-4 h-4 w-40" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[...Array(8)].map((_, i) => (
                            <div key={i}>
                                <DefaultSkeleton className="mb-1 h-4 w-24" />
                                <DefaultSkeleton className="h-5 w-20" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-start rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800">
                    <DefaultSkeleton className="mb-2 h-6 w-32" />
                    <DefaultSkeleton className="mb-4 h-4 w-40" />

                    <div className="relative flex w-full items-center justify-center">
                        <DefaultSkeleton className="mx-auto h-[180px] w-[180px] rounded-full" />
                        <DefaultSkeleton className="absolute top-1/2 left-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-6 md:grid-cols-3 md:gap-6">
                <div className="hidden rounded-lg bg-white p-4 shadow-sm md:block md:p-6 dark:bg-gray-800">
                    <DefaultSkeleton className="mb-2 h-6 w-32" />
                    <DefaultSkeleton className="mb-4 h-4 w-40" />

                    <DefaultSkeleton className="h-96 w-full" />
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800">
                    <DefaultSkeleton className="mb-2 h-6 w-32" />
                    <DefaultSkeleton className="mb-4 h-4 w-40" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[...Array(8)].map((_, i) => (
                            <div key={i}>
                                <DefaultSkeleton className="mb-1 h-4 w-24" />
                                <DefaultSkeleton className="h-5 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <DefaultSkeleton className="mb-2 h-6 w-32" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800"
                            role="group"
                            aria-label="Global stat skeleton">
                            <DefaultSkeleton className="mb-2 h-4 w-24" />
                            <DefaultSkeleton className="h-8 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
