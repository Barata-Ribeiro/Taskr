import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function StatsCardsSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800">
                    <DefaultSkeleton className="mb-4 h-4 w-32" />
                    <DefaultSkeleton className="h-10 w-20" />
                </div>
            ))}
        </div>
    )
}
