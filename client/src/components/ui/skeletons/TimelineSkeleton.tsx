import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function TimelineSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">
                        <DefaultSkeleton className="h-8 w-8 rounded-full" />
                        {index < 4 && <div className="mt-2 ml-4 h-8 w-px bg-gray-200" />}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <DefaultSkeleton className="h-6 w-6 rounded-full" />
                            <DefaultSkeleton className="h-4 w-20" />
                            <DefaultSkeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <DefaultSkeleton className="h-4 w-3/4" />
                        <DefaultSkeleton className="h-3 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    )
}
