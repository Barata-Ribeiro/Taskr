import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

function CommentSkeleton({ depth = 0, maxDepth = 2 }: Readonly<{ depth?: number; maxDepth?: number }>) {
    return (
        <div
            className={[
                "mb-2 rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900",
                depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4 dark:border-gray-700" : undefined,
            ].join(" ")}>
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <DefaultSkeleton className="h-8 w-8 rounded-full" />
                    <DefaultSkeleton className="h-4 w-24" />
                </div>
                <div className="inline-flex gap-x-2">
                    <DefaultSkeleton className="h-3 w-16" />
                    <DefaultSkeleton className="h-3 w-12" />
                </div>
            </div>

            <DefaultSkeleton className="mb-1 h-4 w-full" />
            <DefaultSkeleton className="h-4 w-3/4" />

            {depth < maxDepth && (
                <div className="mt-2 space-y-2">
                    {[...Array(depth === 0 ? 2 : 1)].map((_, i) => (
                        <CommentSkeleton key={i} depth={depth + 1} maxDepth={maxDepth} />
                    ))}
                </div>
            )}
        </div>
    )
}

function NewCommentFormSkeleton() {
    return (
        <div className="mb-4 grid w-full grid-cols-1 items-start gap-x-4 border-b border-gray-200 pb-4 md:grid-cols-[auto_1fr] dark:border-gray-700">
            <div className="mb-2 inline-flex items-center gap-x-2 md:mb-0">
                <DefaultSkeleton className="h-8 w-8 rounded-full" />
                <DefaultSkeleton className="h-4 w-24 md:hidden" />
            </div>

            <div className="w-full space-y-6">
                <DefaultSkeleton className="h-32 w-full rounded-md" />

                <div className="flex gap-2">
                    <DefaultSkeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
        </div>
    )
}

export default function CommentTreeSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait.">
            <header className="mb-4 border-b border-gray-200 pb-5 dark:border-gray-700">
                <div className="-mt-2 -ml-2 flex flex-wrap items-baseline">
                    <DefaultSkeleton className="mt-2 ml-2 h-6 w-24 rounded" />
                    <DefaultSkeleton className="mt-1 ml-2 h-4 w-16 rounded" />
                </div>
            </header>

            <NewCommentFormSkeleton />

            <CommentSkeleton />
        </div>
    )
}
