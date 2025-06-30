import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function WelcomeBannerSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="grid grid-cols-[auto_1fr] items-center gap-x-4 overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800">
            <DefaultSkeleton className="h-16 w-16 rounded-full" />
            <div className="flex flex-col">
                <DefaultSkeleton className="mb-2 h-7 w-40" />
                <DefaultSkeleton className="mb-2 h-4 w-24" />
                <DefaultSkeleton className="h-5 w-16" />
            </div>
        </div>
    )
}
