import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"
import { Fragment } from "react"

const COLUMN_LABELS = [
    { key: "toDo", label: "To Do" },
    { key: "inProgress", label: "In Progress" },
    { key: "done", label: "Done" },
]

function TaskCardSkeleton() {
    return (
        <div className="grid gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
            {/* Title and edit button */}
            <div className="flex items-center justify-between gap-4">
                <DefaultSkeleton className="h-6 w-32" />
                <DefaultSkeleton className="size-6 rounded" />
            </div>

            {/* Description */}
            <DefaultSkeleton className="h-4 w-48" />

            {/* Assignees and badges */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <DefaultSkeleton
                            key={i}
                            className="size-6 rounded-full border-2 border-white dark:border-gray-800"
                        />
                    ))}
                </div>
                <div className="grid justify-items-end gap-2">
                    <DefaultSkeleton className="h-4 w-16 rounded" />
                    <DefaultSkeleton className="h-4 w-20 rounded" />
                </div>
            </div>
        </div>
    )
}

function TaskColumnSkeleton({ label }: Readonly<{ label: string }>) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="inline-flex items-center gap-x-2 border-b border-gray-200 pb-2 font-medium dark:border-gray-700">
                <div className="rounded-md border-l-4 bg-gray-100 px-3 py-1 font-semibold text-gray-800 select-none dark:bg-gray-800 dark:text-gray-100">
                    {label}
                </div>
                <span className="text-sm">( ?? )</span>
            </div>
            {[...Array(4)].map((_, i) => (
                <TaskCardSkeleton key={i} />
            ))}
        </div>
    )
}

export default function TaskBoardSkeleton() {
    return (
        <Fragment>
            <div
                role="status"
                aria-label="Loading in progress... Please wait."
                className="grid gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
                {/* Back to Project link skeleton */}
                <div className="inline-flex items-center gap-x-2">
                    <DefaultSkeleton className="size-4 rounded-full" />
                    <DefaultSkeleton className="h-4 w-32" />
                </div>
                <div className="grid gap-2">
                    <div className="flex flex-wrap items-center justify-between">
                        <DefaultSkeleton className="h-7 w-40" />

                        {/* New Task button skeleton */}
                        <DefaultSkeleton className="h-9 w-32 rounded-md" />
                    </div>

                    <DefaultSkeleton className="h-4 w-80" />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                {COLUMN_LABELS.map(col => (
                    <TaskColumnSkeleton key={col.key} label={col.label} />
                ))}
            </div>
        </Fragment>
    )
}
