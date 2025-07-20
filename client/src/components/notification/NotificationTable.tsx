"use client"

import { Page } from "@/@types/application"
import { Notification } from "@/@types/notification"
import NotificationRow from "@/components/notification/NotificationRow"
import NavigationPagination from "@/components/shared/NavigationPagination"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultCheckbox from "@/components/ui/DefaultCheckbox"
import { Button, Transition } from "@headlessui/react"
import { MailOpenIcon, MessageCircleWarningIcon, Trash2Icon, XIcon } from "lucide-react"
import { Fragment, useLayoutEffect, useRef, useState } from "react"

interface NotificationTableProps {
    notifications: Notification[]

    pagination: Page
}

export default function NotificationTable({ notifications, pagination }: Readonly<NotificationTableProps>) {
    const [initialNotifications, setInitialNotifications] = useState<Notification[]>(notifications)
    const checkbox = useRef<HTMLInputElement>(null)
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [selectedNotifications, setSelectedNotifications] = useState<Notification[]>([])
    const [show, setShow] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useLayoutEffect(() => {
        setInitialNotifications(notifications)
        const isIndeterminate = selectedNotifications.length > 0 && selectedNotifications.length < notifications.length
        setChecked(selectedNotifications.length === notifications.length)
        setIndeterminate(isIndeterminate)
        if (checkbox.current) checkbox.current.indeterminate = isIndeterminate
    }, [notifications, selectedNotifications])

    function toggleAll() {
        setSelectedNotifications(checked || indeterminate ? [] : notifications)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }

    async function deleteSelected() {
        if (selectedNotifications.length <= 0) return
        // TODO: Implement the delete logic here
    }

    async function toggleBulkRead() {
        if (selectedNotifications.length <= 0) return
        // TODO: Implement the bulk read toggle logic here
    }

    async function toggleRead(notification: Notification) {
        // TODO: Implement the toggle read logic here
    }

    return (
        <Fragment>
            <div className="relative mt-8 flow-root">
                <div className="-mx-0 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                            <table className="min-w-full table-fixed text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="group relative inline-flex items-center gap-x-3">
                                                <DefaultCheckbox
                                                    ref={checkbox}
                                                    checked={checked}
                                                    onChange={toggleAll}
                                                    aria-label="Select all notifications"
                                                    title="Select all notifications"
                                                />

                                                {selectedNotifications.length > 0 && (
                                                    <div className="absolute top-4 left-full z-20 ml-2 inline-flex -translate-y-1/2 items-center gap-x-1 rounded border border-gray-300 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                                        <DefaultButton
                                                            width="fit"
                                                            buttonType="ghost"
                                                            isIconOnly
                                                            aria-label="Change selected notification status"
                                                            title="Change selected notification status"
                                                            onClick={toggleBulkRead}>
                                                            <MailOpenIcon aria-hidden size={16} />
                                                        </DefaultButton>

                                                        <DefaultButton
                                                            width="fit"
                                                            buttonType="ghost"
                                                            isIconOnly
                                                            aria-label="Delete selected notification"
                                                            title="Delete selected notification"
                                                            onClick={deleteSelected}>
                                                            <Trash2Icon aria-hidden size={16} />
                                                        </DefaultButton>
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Title
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Message
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Type
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Sent Date
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Manage</span>
                                        </th>
                                    </tr>
                                </thead>

                                {pagination.totalElements > 0 && (
                                    <tbody>
                                        {initialNotifications.map(notification => (
                                            <NotificationRow
                                                key={notification.id}
                                                notification={notification}
                                                toggleRead={toggleRead}
                                                selectedNotifications={selectedNotifications}
                                                setSelectedNotifications={setSelectedNotifications}
                                            />
                                        ))}
                                    </tbody>
                                )}

                                {pagination.totalElements <= 0 && (
                                    <tbody>
                                        <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                No notifications found.
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>

                            <NavigationPagination pageInfo={pagination} />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div
                    aria-live="assertive"
                    className="pointer-events-none fixed right-0 bottom-4 z-50 flex w-full items-end px-4 py-6 sm:items-start sm:p-6">
                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <Transition show={show}>
                            <div className="ring-opacity-5 pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-red-50 shadow-lg ring-1 ring-red-200 transition data-[closed]:opacity-0 data-[enter]:transform data-[enter]:duration-300 data-[enter]:ease-out data-[closed]:data-[enter]:translate-y-2 data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                                <div className="p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <MessageCircleWarningIcon aria-hidden className="size-6 text-red-400" />
                                        </div>
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <p className="text-sm font-medium text-red-600">An Error Occurred!</p>
                                            <p className="mt-1 text-sm text-red-950">{error}</p>
                                        </div>
                                        <div className="ml-4 flex flex-shrink-0">
                                            <Button
                                                type="button"
                                                onClick={() => setShow(false)}
                                                className="text-shadow-900 hover:text-shadow-700 focus:ring-marigold-500 inline-flex cursor-pointer rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none">
                                                <span className="sr-only">Close</span>
                                                <XIcon aria-hidden />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            )}
        </Fragment>
    )
}
