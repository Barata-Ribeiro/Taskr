import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function UserStatsSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait.">
            <div className="flex items-center gap-2">
                <DefaultSkeleton className="h-8 w-48" />
                <DefaultSkeleton className="h-8 w-24" />
            </div>

            <div className="mt-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-md border border-gray-200 p-2 dark:border-gray-700">
                        <div>
                            <DefaultSkeleton className="mb-2 h-4 w-40" />
                            <DefaultSkeleton className="h-4 w-28" />
                        </div>
                        <DefaultSkeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <DefaultSkeleton className="mb-2 h-4 w-32" />
                        <DefaultSkeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}
