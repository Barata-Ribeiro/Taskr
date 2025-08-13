import NavLogo from "@/components/shared/NavLogo"
import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function SidebarSkeleton() {
    return (
        <aside
            role="status"
            aria-label="Loading in progress... Please wait."
            className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <NavLogo />

                <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul className="-mx-2 space-y-1">
                                {[...Array(4)].map((_, i) => (
                                    <li key={i}>
                                        <div className="flex gap-x-3 rounded-md p-2">
                                            <DefaultSkeleton className="size-6 rounded" />
                                            <DefaultSkeleton className="h-5 w-24" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <DefaultSkeleton className="mb-2 h-4 w-20" />
                            <ul className="-mx-2 mt-2 space-y-1">
                                {[...Array(2)].map((_, i) => (
                                    <li key={i}>
                                        <div className="flex gap-x-3 rounded-md p-2">
                                            <DefaultSkeleton className="size-6 rounded" />
                                            <DefaultSkeleton className="h-5 w-16" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="mt-auto">
                            <div className="flex items-center gap-x-3">
                                <DefaultSkeleton className="size-8 rounded-full" />
                                <DefaultSkeleton className="h-4 w-24" />
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}
