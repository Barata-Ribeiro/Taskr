import getAllNotificationsPaginated from "@/actions/notifications/get-all-notifications-paginated"
import StateError from "@/components/feedback/state-error"
import NavigationPagination from "@/components/filters/navigation-pagination"
import TableCompleteFilter from "@/components/filters/table-complete-filter"
import TableRowNotification from "@/components/items/table-row-notification"
import { Paginated, ProblemDetails } from "@/interfaces/actions"
import { Notification } from "@/interfaces/notifications"
import { auth } from "auth"
import { Metadata } from "next"
import { redirect } from "next/navigation"

interface NotificationsPageProps {
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "Notifications",
    description: "Listing of all the notifications sent to you by the system.",
}

export default async function NotificationsPage({ searchParams }: Readonly<NotificationsPageProps>) {
    if (!searchParams) return null

    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "issuedAt"

    const sessionPromise = auth()
    const statePromise = getAllNotificationsPaginated({ page, perPage, direction, orderBy })

    const [session, state] = await Promise.all([sessionPromise, statePromise])
    if (!session) redirect("/auth/login")
    if (state?.error) return <StateError error={state.error as ProblemDetails} />

    const pagination = state.response?.data as Paginated<Notification>
    const content = pagination.content ?? []
    const pageInfo = pagination.page

    return (
        <section
            id="notifications-list-section"
            aria-labelledby="notifications-list-title"
            className="px-4 sm:px-6 lg:px-8">
            <header className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 id="notifications-list-title" className="text-base font-semibold leading-6 text-gray-900">
                        Notifications
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Listing of all the notifications sent to you by the system.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <TableCompleteFilter allowSearch={false} filterType="notifications" />
                </div>
            </header>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Id
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Title
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Is Read
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Read At
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Issued At
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Manage</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {content.map((notif, idx) => (
                                        <TableRowNotification key={`${notif.id}_${idx}`} notification={notif} />
                                    ))}

                                    {content.length < 1 && (
                                        <tr className="border-b border-gray-300 bg-white">
                                            <td
                                                colSpan={6}
                                                className="py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6 lg:pl-8">
                                                No notifications found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <NavigationPagination usePageInfo={pageInfo} contentSize={content.length} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
