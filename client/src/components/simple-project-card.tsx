"use client"

import Badge from "@/components/badges/badge"
import BadgePriority from "@/components/badges/badge-priority"
import { Task } from "@/interfaces/task"
import parseDate from "@/utils/parse-date"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { FaChevronDown } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

interface SimpleProjectCardProps {
    name: string
    isManager: boolean
    totalTasks: number
    latestTasks: Task[]
}

export default function SimpleProjectCard({
    name,
    isManager,
    totalTasks,
    latestTasks,
}: Readonly<SimpleProjectCardProps>) {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <DisclosureButton className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-x-4">
                            <div className="inline-flex items-center gap-x-2">
                                <h3 className="text-base font-semibold hover:underline">{name}</h3>{" "}
                                <span className="flex-none select-none rounded-md bg-ebony-50 px-1.5 py-0.5 text-xs font-medium text-ebony-700 ring-1 ring-inset ring-ebony-700/10 sm:order-none">
                                    {isManager ? "Manager" : "Member"}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">({totalTasks}) task(s)</span>
                        </div>

                        <FaChevronDown
                            aria-hidden="true"
                            className={twMerge(
                                "h-4 w-4 text-gray-400 transition-transform",
                                open && "rotate-180 transform",
                            )}
                        />
                    </DisclosureButton>

                    <DisclosurePanel
                        transition
                        className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0">
                        <div className="flow-root px-2">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="whitespace-nowrap py-2.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                    Title
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="whitespace-nowrap px-2 py-2.5 text-left text-sm font-semibold text-gray-900">
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="whitespace-nowrap px-2 py-2.5 text-left text-sm font-semibold text-gray-900">
                                                    Priority
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="whitespace-nowrap px-2 py-2.5 text-left text-sm font-semibold text-gray-900">
                                                    Due Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {latestTasks.map(task => (
                                                <tr key={task.id}>
                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                                        {task.title}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm capitalize text-gray-900">
                                                        <Badge
                                                            variant={task.status !== "DONE" ? "default" : "secondary"}>
                                                            {task.status.toLowerCase().replace(/_/g, " ")}
                                                        </Badge>
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                                                        <BadgePriority priority={task.priority} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                                                        {parseDate(task.dueDate)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}
