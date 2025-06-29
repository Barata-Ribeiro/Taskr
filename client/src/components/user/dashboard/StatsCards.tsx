import getUserAccount from "@/actions/user/get-user-account"
import { BellIcon, FoldersIcon, MessagesSquareIcon, UsersIcon } from "lucide-react"

export default async function StatsCards() {
    const accountResponse = await getUserAccount()

    // TODO: Create error component
    if (!accountResponse.ok || !accountResponse.response) {
        return <p className="text-red-500">Error loading account data</p>
    }

    const account = accountResponse.response.data?.data

    const stats = [
        { name: "Projects Created", icon: FoldersIcon, value: account?.totalCreatedProjects ?? 0 },
        { name: "Memberships", icon: UsersIcon, value: account?.memberships?.length ?? 0 },
        { name: "Comments Made", icon: MessagesSquareIcon, value: account?.totalCommentsMade ?? 0 },
        {
            name: "Notifications",
            icon: BellIcon,
            value: Math.max(account?.unreadNotificationsCount ?? 0, account?.readNotificationsCount ?? 0),
        },
    ]

    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(item => (
                <div
                    key={item.name}
                    className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800">
                    <dt className="flex items-center justify-between truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        {item.name}
                        <item.icon />
                    </dt>

                    <dd className="mt-1 flex items-end justify-between text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                        {item.value}
                        {item.name === "Notifications" && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {account?.unreadNotificationsCount} (Unread)
                            </span>
                        )}
                    </dd>
                </div>
            ))}
        </section>
    )
}
