import { ProblemDetails } from "@/@types/application"
import adminGetAllUsersPaginated from "@/actions/admin/admin-get-all-users-paginated"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import Avatar from "@/components/user/Avatar"
import Badge from "@/components/user/Badge"
import dateFormatter from "@/utils/date-formatter"
import { ChevronRightCircle } from "lucide-react"
import { Session } from "next-auth"
import Link from "next/link"

export default async function LatestUsers({ session }: Readonly<{ session: Session | null }>) {
    if (!session) return null
    const state = await adminGetAllUsersPaginated({ page: 0, perPage: 10, direction: "DESC", orderBy: "createdAt" })

    if (!state.ok || !state.response?.data) {
        const isProblemDetails = (state.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (state.error as ProblemDetails).detail
            : "An error occurred while fetching the users."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const baseUrl = `/dashboard/${session.user.username}`

    const pagination = state.response?.data
    const content = pagination.content ?? []

    return (
        <section aria-labelledby="latest-users-section-title">
            <header className="mb-4 border-b border-gray-200 pb-5 max-sm:space-y-2 sm:flex sm:items-center sm:justify-between dark:border-gray-700">
                <h2 id="latest-users-section-title" className="text-2xl font-bold">
                    Latest Users
                </h2>
                <DefaultLinkButton buttonType="color" width="fit" href={`${baseUrl}/admin/users`}>
                    View All
                </DefaultLinkButton>
            </header>

            <ul
                className="divide-y divide-gray-100 overflow-hidden bg-white shadow-xs ring-1 ring-gray-200 sm:rounded-xl dark:bg-gray-800 dark:ring-gray-700"
                aria-label="List of latest users">
                {content.map(user => {
                    const profileUrl = `${baseUrl}/profile/${user.username}`
                    const profileLabel = `View profile of ${user.username}`
                    const mailToUrl = `mailto:${user.email}`
                    const mailToLabel = `Send email to ${user.email}`

                    const isCurrentUser = session.user.username === user.username

                    return (
                        <li
                            key={user.id}
                            className="group relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8 dark:hover:bg-gray-700">
                            <div className="inline-flex min-w-0 items-center gap-x-4">
                                <Avatar url={user.avatarUrl} name={user.username} size="small" />
                                <div className="min-w-0 flex-auto">
                                    <Link
                                        href={profileUrl}
                                        className="text-sm/6 font-semibold select-none"
                                        aria-label={profileLabel}>
                                        {user.username}{" "}
                                        {isCurrentUser && <span className="text-xs text-indigo-500">(You)</span>}
                                    </Link>

                                    <Link
                                        href={mailToUrl}
                                        className="mt-1 flex text-xs/5 text-gray-500 hover:underline dark:text-gray-400"
                                        aria-label={mailToLabel}>
                                        {user.email}
                                    </Link>
                                </div>
                            </div>

                            <div className="inline-flex shrink-0 items-center gap-x-4">
                                <div className="hidden sm:flex sm:flex-col sm:items-end">
                                    <Badge userRole={user.role} />
                                    <time
                                        className="mt-1 text-xs/5 text-gray-500 dark:text-gray-400"
                                        dateTime={user.createdAt.toString()}
                                        aria-label={`Joined on ${dateFormatter(user.createdAt)}`}>
                                        {dateFormatter(user.createdAt)}
                                    </time>
                                </div>

                                <DefaultLinkButton
                                    href={profileUrl}
                                    buttonType="ghost"
                                    width="fit"
                                    isIconOnly
                                    aria-label={profileLabel}
                                    title={profileLabel}>
                                    <ChevronRightCircle
                                        aria-hidden="true"
                                        size={20}
                                        className="flex-none text-gray-400"
                                    />
                                </DefaultLinkButton>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
