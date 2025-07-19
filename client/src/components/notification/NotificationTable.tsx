"use client"

import { Page } from "@/@types/application"
import { Notification } from "@/@types/notification"
import NavigationPagination from "@/components/shared/NavigationPagination"
import DefaultCheckbox from "@/components/ui/DefaultCheckbox"
import { Button, Transition } from "@headlessui/react"
import { MessageCircleWarningIcon, XIcon } from "lucide-react"
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
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <DefaultCheckbox label="" />
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
                                            <span className="sr-only">Status</span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-1"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-1" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Apple MacBook Pro 17
                                        </th>
                                        <td className="px-6 py-4">Silver</td>
                                        <td className="px-6 py-4">Laptop</td>
                                        <td className="px-6 py-4">$2999</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-2"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-2" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Microsoft Surface Pro
                                        </th>
                                        <td className="px-6 py-4">White</td>
                                        <td className="px-6 py-4">Laptop PC</td>
                                        <td className="px-6 py-4">$1999</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Magic Mouse 2
                                        </th>
                                        <td className="px-6 py-4">Black</td>
                                        <td className="px-6 py-4">Accessories</td>
                                        <td className="px-6 py-4">$99</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Apple Watch
                                        </th>
                                        <td className="px-6 py-4">Black</td>
                                        <td className="px-6 py-4">Watches</td>
                                        <td className="px-6 py-4">$199</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Apple iMac
                                        </th>
                                        <td className="px-6 py-4">Silver</td>
                                        <td className="px-6 py-4">PC</td>
                                        <td className="px-6 py-4">$2999</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Apple AirPods
                                        </th>
                                        <td className="px-6 py-4">White</td>
                                        <td className="px-6 py-4">Accessories</td>
                                        <td className="px-6 py-4">$399</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            iPad Pro
                                        </th>
                                        <td className="px-6 py-4">Gold</td>
                                        <td className="px-6 py-4">Tablet</td>
                                        <td className="px-6 py-4">$699</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Magic Keyboard
                                        </th>
                                        <td className="px-6 py-4">Black</td>
                                        <td className="px-6 py-4">Accessories</td>
                                        <td className="px-6 py-4">$99</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            Smart Folio iPad Air
                                        </th>
                                        <td className="px-6 py-4">Blue</td>
                                        <td className="px-6 py-4">Accessories</td>
                                        <td className="px-6 py-4">$79</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-3"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-green-600 dark:focus:ring-offset-gray-800"
                                                />
                                                <label htmlFor="checkbox-table-search-3" className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            AirTag
                                        </th>
                                        <td className="px-6 py-4">Silver</td>
                                        <td className="px-6 py-4">Accessories</td>
                                        <td className="px-6 py-4">$29</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                className="font-medium text-green-600 hover:underline dark:text-green-500">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>

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
