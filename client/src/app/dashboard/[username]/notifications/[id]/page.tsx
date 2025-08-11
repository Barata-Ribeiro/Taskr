import changeNotifStatus from "@/actions/notification/change-notif-status"
import deleteNotifById from "@/actions/notification/delete-notif-by-id"
import getNotifById from "@/actions/notification/get-notif-by-id"
import NotificationTypeBadge from "@/components/notification/NotificationTypeBadge"
import DefaultButton from "@/components/ui/DefaultButton"
import dateFormatter from "@/utils/date-formatter"
import dateToNowFormatter from "@/utils/date-to-now-formatter"
import { auth } from "auth"
import { MailIcon, MailOpenIcon, MoveLeftIcon, Trash2Icon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import React from "react"

export const metadata: Metadata = {
    title: "Notification Details",
    description: "View and manage your notification.",
}

interface NotificationPageProps {
    params: Promise<{ username: string; id: string }>
}

export default async function NotificationPage({ params }: Readonly<NotificationPageProps>) {
    const [{ id, username }, session] = await Promise.all([params, auth()])

    if (!session) redirect("/auth/login")
    if (session.user?.username !== username) redirect(`/dashboard/${session.user?.username}/notifications`)

    const state = await getNotifById(id)
    const notification = state.response?.data
    if (!notification) return notFound()

    async function handleReadToggle() {
        "use server"
        if (!notification) throw new Error("Notification not found")
        await changeNotifStatus(notification.id, !notification.read)
    }

    async function handleDelete() {
        "use server"
        if (!notification) throw new Error("Notification not found")
        await deleteNotifById(notification.id)
        redirect(`/dashboard/${username}/notifications`)
    }

    return (
        <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Link
                href={`/dashboard/${session.user?.username}/notifications`}
                aria-label="Back to Notifications"
                title="Back to Notifications"
                className="mb-6 inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <MoveLeftIcon aria-hidden size={16} /> Back to Notifications
            </Link>

            <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{notification.title}</h2>
                    <NotificationTypeBadge type={notification.type} />
                </div>

                <p className="prose dark:prose-invert prose-gray border-y border-gray-200 py-4 dark:border-gray-700">
                    {notification.message}
                </p>

                <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="inline-flex items-center gap-x-2 divide-x divide-gray-200 dark:divide-gray-700">
                        <time
                            dateTime={notification.createdAt}
                            className="pr-2 text-xs text-gray-500 dark:text-gray-400">
                            {dateFormatter(notification.createdAt)}
                        </time>{" "}
                        <p className="text-xs text-gray-300 dark:text-gray-500">
                            {dateToNowFormatter(notification.createdAt).text}
                        </p>
                    </div>

                    <span>Read: {notification.read ? "Yes" : "No"}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <form action={handleReadToggle}>
                        <DefaultButton type="submit" buttonType={notification.read ? "ghost" : "color"} autoFocus>
                            {notification.read ? (
                                <MailIcon aria-hidden size={16} />
                            ) : (
                                <MailOpenIcon aria-hidden size={16} />
                            )}
                            {notification.read ? "Mark as Unread" : "Mark as Read"}
                        </DefaultButton>
                    </form>
                    <form action={handleDelete}>
                        <DefaultButton type="submit" buttonType="danger">
                            <Trash2Icon aria-hidden size={16} />
                            Delete
                        </DefaultButton>
                    </form>
                </div>
            </div>
        </section>
    )
}
