import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function ProjectMembershipsSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <div className="px-4 pt-4 sm:flex-1 sm:px-6 sm:pt-6">
                <DefaultSkeleton className="mb-2 h-6 w-40" />
                <DefaultSkeleton className="h-4 w-64" />
            </div>
            <div className="mt-6 flex flex-col gap-y-4 border-t border-gray-100 p-4 sm:p-6 dark:border-gray-700">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="relative flex justify-between gap-x-6 rounded-lg px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8 dark:hover:bg-gray-700">
                        <div className="inline-flex min-w-0 items-center gap-x-4">
                            <DefaultSkeleton className="size-10 rounded-full" />
                            <div className="min-w-0 flex-auto">
                                <DefaultSkeleton className="mb-2 h-4 w-32" />
                                <DefaultSkeleton className="h-3 w-20" />
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-x-4">
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                                <DefaultSkeleton className="mb-2 h-5 w-20" />
                                <DefaultSkeleton className="h-3 w-24" />
                            </div>

                            <DefaultSkeleton className="size-8 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
