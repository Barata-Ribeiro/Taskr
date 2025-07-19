import { Paginated, QueryParams } from "@/@types/application"
import { Notification } from "@/@types/notification"
import getAllNotificationsPaginated from "@/actions/notification/get-all-notifications-paginated"
import NotificationTable from "@/components/notification/NotificationTable"
import { auth } from "auth"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

interface NotificationsPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "Notifications",
    description: "Manage your notifications here.",
}

export default async function NotificationsPage({ params, searchParams }: Readonly<NotificationsPageProps>) {
    const [{ username }, pageParams] = await Promise.all([params, searchParams])
    if (!username) notFound()
    if (!pageParams) return null

    const { page = 0, perPage = 10, direction = "DESC", orderBy = "createdAt" } = pageParams as QueryParams

    const [session, state] = await Promise.all([
        auth(),
        getAllNotificationsPaginated({ page, perPage, direction, orderBy }),
    ])

    if (!session) redirect("/auth/login")
    if (session.user?.username !== username) redirect(`/dashboard/${session.user?.username}/notifications`)

    const pagination = state.response?.data as Paginated<Notification>
    const content = pagination.content ?? []

    return (
        <section
            aria-labelledby="notifications-section-id"
            aria-describedby="notifications-description-id"
            className="px-4 sm:px-6 lg:px-8">
            <header>
                <h1 className="text-xl font-semibold" id="notifications-section-id">
                    Notifications
                </h1>
                <p className="mt-2 text-base text-gray-700 dark:text-gray-400" id="notifications-description-id">
                    There are currently {pagination.page.totalElements} notification(s) available. You can manage your
                    notifications here.
                </p>
            </header>

            <NotificationTable notifications={content} pagination={pagination.page} />
        </section>
    )
}
