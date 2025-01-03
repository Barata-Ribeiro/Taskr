"use client"

import deleteNotificationById from "@/actions/notifications/delete-notification-by-id"
import patchMarkNotifAsRead from "@/actions/notifications/patch-mark-notif-as-read"
import NotificationReadBadge from "@/components/items/notification-read-badge"
import DeletedNotification from "@/components/skeletons/deleted-notification"
import { Notification } from "@/interfaces/notifications"
import parseDate from "@/utils/parse-date"
import { Button } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaTrash } from "react-icons/fa6"
import { HiOutlineInformationCircle } from "react-icons/hi2"
import { MdMailOutline, MdMarkEmailUnread } from "react-icons/md"

interface InlineNotificationProps {
    notification: Notification
}

export default function InlineNotification({ notification }: Readonly<InlineNotificationProps>) {
    const router = useRouter()
    const [isRead, setIsRead] = useState(notification.read)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isPending, setIsPending] = useState(false)

    async function markAsRead() {
        if (isRead || isPending) return

        setIsPending(true)

        const state = await patchMarkNotifAsRead({ id: notification.id })

        if (state.error) {
            setIsPending(false)
            return router.refresh()
        }

        const data = state.response?.data as Notification

        setIsRead(data.read)
        setIsPending(false)
    }

    async function deleteNotification() {
        if (isPending || isDeleted) return

        setIsPending(true)

        const state = await deleteNotificationById({ id: notification.id })

        if (state.error) {
            setIsPending(false)
            return router.refresh()
        }

        setIsPending(false)
        setIsDeleted(state.ok)
    }

    return isDeleted ? (
        <DeletedNotification />
    ) : (
        <article
            id={notification.id.toString()}
            aria-labelledby={notification.id + "_" + notification.title}
            className="min-w-0 p-4 lg:flex lg:items-center lg:justify-between">
            <div className="flex flex-col items-start gap-x-2 gap-y-4 md:flex-row md:items-center">
                <span aria-hidden="true" className="rounded-lg bg-blue-100 p-2">
                    <HiOutlineInformationCircle aria-hidden="true" className="aspect-auto h-6 w-6 text-blue-500" />
                </span>
                <header className="grid grid-rows-2 items-start gap-y-1">
                    <div className="inline-flex items-center gap-x-2">
                        <h3 id={notification.id + "_" + notification.title} className="text-sm font-semibold">
                            {notification.title}
                        </h3>
                        <NotificationReadBadge isRead={isRead} />
                    </div>
                    <time dateTime={notification.issuedAt} className="text-xs text-gray-500">
                        {parseDate(notification.issuedAt)}
                    </time>
                </header>

                <p className="border-0 p-0 text-base leading-7 text-gray-900 md:border-l md:pl-2">
                    {notification.message}
                </p>
            </div>

            <div className="mt-5 flex gap-3 lg:ml-4 lg:mt-0">
                <Button
                    type="button"
                    disabled={isRead || isPending}
                    onClick={markAsRead}
                    title="Mark as Read"
                    className="rounded-md bg-white p-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50">
                    <span className="sr-only">Mark as Read</span>
                    {!isRead ? (
                        <MdMarkEmailUnread aria-hidden="true" className="size-5 text-gray-400" />
                    ) : (
                        <MdMailOutline aria-hidden="true" className="size-5 text-gray-400" />
                    )}
                </Button>

                <Button
                    type="button"
                    disabled={isDeleted}
                    onClick={deleteNotification}
                    title="Delete Notification"
                    className="rounded-md bg-red-600 p-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:bg-red-800 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50">
                    <span className="sr-only">Delete Notification</span>
                    <FaTrash aria-hidden="true" className="size-4" />
                </Button>
            </div>
        </article>
    )
}
