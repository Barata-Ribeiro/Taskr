import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function GlobalStatsSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait.">
            <DefaultSkeleton className="mb-2 h-6 w-40" />
            <DefaultSkeleton className="mb-6 h-4 w-96" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    )
}
