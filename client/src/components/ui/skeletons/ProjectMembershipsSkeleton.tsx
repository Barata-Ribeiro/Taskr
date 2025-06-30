import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function ProjectMembershipsSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="space-y-4">
            <div className="grid">
                <DefaultSkeleton className="mb-2 h-6 w-48" />
                <DefaultSkeleton className="h-4 w-64" />
            </div>
            {[...Array(2)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <div className="flex items-center space-x-4">
                        <DefaultSkeleton className="h-8 w-8 rounded-full" />
                        <div>
                            <DefaultSkeleton className="mb-1 h-5 w-32" />
                            <DefaultSkeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DefaultSkeleton className="h-6 w-16" />
                        <DefaultSkeleton className="h-6 w-16" />
                    </div>
                </div>
            ))}
        </div>
    )
}
