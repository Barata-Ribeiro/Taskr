"use client"

import deleteNotificationById from "@/actions/notifications/delete-notification-by-id"
import patchMarkNotifAsRead from "@/actions/notifications/patch-mark-notif-as-read"
import Spinner from "@/components/helpers/spinner"
import NotificationReadBadge from "@/components/items/notification-read-badge"
import DeletedNotification from "@/components/skeletons/deleted-notification"
import { Notification } from "@/interfaces/notifications"
import parseDate from "@/utils/parse-date"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { DialogContent } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MdEmail } from "react-icons/md"

interface TableRowNotificationProps {
    notification: Notification
}

export default function TableRowNotification({ notification }: Readonly<TableRowNotificationProps>) {
    const router = useRouter()
    const [isRead, setIsRead] = useState(notification.read)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [open, setOpen] = useState(false)

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
        if (open) setOpen(false)
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
            <td className="whitespace-nowrap px-3 py-4">
                <Button
                    onClick={() => setOpen(true)}
                    className="text-sm font-semibold text-ebony-600 decoration-2 underline-offset-2 hover:text-ebony-700 hover:underline active:text-ebony-800">
                    {notification.title}
                </Button>
            </td>
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

            {open && (
                <td>
                    <Dialog open={open} onClose={setOpen} className="relative z-50">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                                    <div>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-english-holly-100">
                                            <MdEmail aria-hidden="true" className="h-6 w-6 text-english-holly-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <DialogTitle
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900">
                                                {notification.title}
                                            </DialogTitle>
                                            <DialogContent className="mt-2 text-sm text-gray-500">
                                                {notification.message}
                                            </DialogContent>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <Button
                                            type="button"
                                            disabled={isRead || isPending}
                                            onClick={markAsRead}
                                            aria-label="Mark as Read"
                                            title="Mark as Read"
                                            className="inline-flex w-full justify-center rounded-md bg-ebony-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ebony-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 sm:col-start-2">
                                            {open && isPending ? (
                                                <>
                                                    <Spinner /> Loading...
                                                </>
                                            ) : (
                                                "Read"
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            data-autofocus
                                            onClick={() => setOpen(false)}
                                            aria-label="Close"
                                            title="Close"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">
                                            Close
                                        </Button>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                </td>
            )}
        </tr>
    )
}
