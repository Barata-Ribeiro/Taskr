import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"
import MarkdownEditorSkeleton from "@/components/ui/skeletons/MarkdownEditorSkeleton"

export default function UserUpdateProfileFormSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                {/* Avatar and modal skeleton */}
                <div className="col-span-full flex items-center gap-x-8">
                    <DefaultSkeleton className="aspect-square size-24 rounded-lg" />
                    <div className="grid gap-y-2">
                        <DefaultSkeleton className="h-9 w-32 rounded-md" />
                        <DefaultSkeleton className="h-3 w-24" />
                    </div>
                </div>

                {/* Input skeletons */}
                <DefaultSkeleton className="h-10 w-full sm:col-span-3" />
                <DefaultSkeleton className="h-10 w-full sm:col-span-3" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <DefaultSkeleton key={i} className="col-span-full h-10" />
                ))}

                {/* Markdown editor skeleton */}
                <div className="col-span-full">
                    <MarkdownEditorSkeleton />
                </div>

                <DefaultSkeleton className="h-10 w-full sm:col-span-3" />
                <DefaultSkeleton className="h-10 w-full sm:col-span-3" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <DefaultSkeleton key={i} className="col-span-full h-10" />
                ))}
            </div>

            <div className="mt-6 grid gap-y-6">
                <DefaultSkeleton className="h-10 w-32 rounded-md" />
            </div>
        </div>
    )
}
