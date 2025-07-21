import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

function NotificationRowSkeleton() {
    return (
        <tr className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <td className="p-4">
                <DefaultSkeleton className="size-4 rounded" />
            </td>
            <td className="px-6 py-4">
                <DefaultSkeleton className="h-4 w-32" />
            </td>
            <td className="px-6 py-4">
                <DefaultSkeleton className="h-4 w-48" />
            </td>
            <td className="px-6 py-4">
                <DefaultSkeleton className="h-4 w-20" />
            </td>
            <td className="px-6 py-4">
                <DefaultSkeleton className="h-4 w-24" />
            </td>
            <td className="px-6 py-4">
                <div className="inline-flex gap-x-2">
                    <DefaultSkeleton className="size-6 rounded" />
                    <DefaultSkeleton className="size-6 rounded" />
                    <DefaultSkeleton className="size-6 rounded" />
                </div>
            </td>
        </tr>
    )
}

export default function NotificationsSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="px-4 sm:px-6 lg:px-8">
            <div>
                <DefaultSkeleton className="mb-2 h-7 w-40" />
                <DefaultSkeleton className="h-4 w-80" />
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-0 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                            <table className="min-w-full table-fixed text-left text-sm">
                                <thead>
                                    <tr>
                                        <th className="p-4">
                                            <DefaultSkeleton className="size-4 rounded" />
                                        </th>
                                        <th className="px-6 py-3">
                                            <DefaultSkeleton className="h-4 w-20" />
                                        </th>
                                        <th className="px-6 py-3">
                                            <DefaultSkeleton className="h-4 w-28" />
                                        </th>
                                        <th className="px-6 py-3">
                                            <DefaultSkeleton className="h-4 w-16" />
                                        </th>
                                        <th className="px-6 py-3">
                                            <DefaultSkeleton className="h-4 w-20" />
                                        </th>
                                        <th className="px-6 py-3">
                                            <DefaultSkeleton className="h-4 w-16" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(8)].map((_, i) => (
                                        <NotificationRowSkeleton key={i} />
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
                                <DefaultSkeleton className="h-5 w-32" />
                                <div className="hidden sm:flex sm:items-center sm:gap-x-2">
                                    {[...Array(5)].map((_, i) => (
                                        <DefaultSkeleton key={i} className="size-8 rounded-md" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
