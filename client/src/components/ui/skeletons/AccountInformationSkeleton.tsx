import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function AccountInformationSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="overflow-hidden rounded-lg bg-white py-5 shadow-sm dark:bg-gray-800">
            <div className="px-4 sm:px-6">
                <DefaultSkeleton className="mb-2 h-6 w-40" />
                <DefaultSkeleton className="h-4 w-64" />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 px-4 pt-6 sm:px-6 md:grid-cols-2 dark:border-gray-700">
                {[...Array(4)].map((_, i) => (
                    <div key={i}>
                        <DefaultSkeleton className="mb-1 h-4 w-24" />
                        <DefaultSkeleton className="h-5 w-32" />
                    </div>
                ))}
            </div>
        </div>
    )
}
