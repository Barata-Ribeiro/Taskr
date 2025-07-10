import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

const COLUMN_LABELS = [
    { key: "toDo", label: "To Do" },
    { key: "inProgress", label: "In Progress" },
    { key: "done", label: "Done" },
]

function TaskCardSkeleton() {
    return (
        <div className="grid gap-2 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
            <DefaultSkeleton className="mb-2 h-5 w-32" />
            <DefaultSkeleton className="mb-4 h-4 w-48" />
            <div className="flex items-center justify-between gap-4">
                <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <DefaultSkeleton
                            key={i}
                            className="size-6 rounded-full border-2 border-white dark:border-gray-800"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function TaskColumnSkeleton({ label }: Readonly<{ label: string }>) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="inline-flex items-center gap-x-2 font-medium">
                <div className="rounded-full bg-gray-100 px-3 py-1 text-2xl font-semibold text-gray-800 select-none dark:bg-gray-800 dark:text-gray-100">
                    {label}
                </div>
                <div className="text-sm">( ?? )</div>
            </div>
            {[...Array(4)].map((_, i) => (
                <TaskCardSkeleton key={i} />
            ))}
        </div>
    )
}

export default function TaskBoardSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {COLUMN_LABELS.map(col => (
                <TaskColumnSkeleton key={col.key} label={col.label} />
            ))}
        </div>
    )
}
