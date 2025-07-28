import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function TaskDetailsSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="block rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
                <DefaultSkeleton className="h-7 w-48" />
                <DefaultSkeleton className="h-6 w-20 rounded" />
            </div>
            <div className="mb-4 inline-flex items-center gap-x-4">
                <DefaultSkeleton className="h-5 w-24 rounded" />
                <DefaultSkeleton className="h-5 w-20 rounded" />
            </div>
            <DefaultSkeleton className="mb-6 h-32 w-full rounded" />
            <div className="mb-4 space-y-2">
                <DefaultSkeleton className="mb-2 h-4 w-24" />
                <div className="flex flex-wrap items-center gap-2">
                    {[...Array(3)].map((_, i) => (
                        <DefaultSkeleton key={i} className="h-8 w-24 rounded-full" />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row dark:text-gray-400">
                <DefaultSkeleton className="h-4 w-32" />
                <DefaultSkeleton className="h-4 w-32" />
            </div>
        </div>
    )
}
