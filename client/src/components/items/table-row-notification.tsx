"use client"

import patchMarkNotifAsRead from "@/actions/notifications/patch-mark-notif-as-read"
import NotificationReadBadge from "@/components/items/notification-read-badge"
import DeletedNotification from "@/components/skeletons/deleted-notification"
import { Notification } from "@/interfaces/notifications"
import parseDate from "@/utils/parse-date"
import { Button } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface TableRowNotificationProps {
    notification: Notification
}

export default function TableRowNotification({ notification }: Readonly<TableRowNotificationProps>) {
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

        // TODO: ADD DELETE NOTIFICATION ACTION

        setIsPending(false)
        setIsDeleted(true)
    }

    const isDisabled = isRead || isPending || isDeleted

    return isDeleted ? (
        <tr>
            <td colSpan={6} className="p-4">
                <DeletedNotification />
            </td>
        </tr>
    ) : (
        <tr>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {notification.id}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{notification.title}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <NotificationReadBadge isRead={isRead} />
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {parseDate(notification.readAt) ?? "Not Read Yet"}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{parseDate(notification.issuedAt)}</td>
            <td className="flex w-full items-center justify-end gap-x-2 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <Button
                    type="button"
                    disabled={isDisabled}
                    onClick={markAsRead}
                    title="Mark as Read"
                    className="text-ebony-600 hover:text-ebony-700 active:text-ebony-800 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50">
                    <span className="sr-only">Mark as Read</span>Read
                </Button>
                <Button
                    type="button"
                    disabled={isPending || isDeleted}
                    onClick={deleteNotification}
                    title="Delete Notification"
                    className="text-red-600 hover:text-red-700 active:text-red-800 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50">
                    Delete
                </Button>
            </td>
        </tr>
    )
}
