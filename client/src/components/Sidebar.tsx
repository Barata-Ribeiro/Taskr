"use client"

import Avatar from "@/components/user/Avatar"
import { Button, Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react"
import { ChartPieIcon, FilesIcon, FolderIcon, HomeIcon, MenuIcon, XIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, useState } from "react"
import taskrLogo from "../../public/images/logo.svg"

export default function Sidebar() {
    const { data: session } = useSession()
    const pathname = usePathname()

    const basePath = `/dashboard/${session?.user.username}`

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigation = [
        { name: "Dashboard", href: `${basePath}`, icon: HomeIcon },
        { name: "Projects", href: `${basePath}/projects`, icon: FolderIcon },
        { name: "Documents", href: `${basePath}/documents`, icon: FilesIcon },
        { name: "Reports", href: `${basePath}/reports`, icon: ChartPieIcon },
    ]

    return (
        <Fragment>
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full">
                        <TransitionChild>
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <Button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="-m-2.5 cursor-pointer p-2.5">
                                    <span className="sr-only">Close sidebar</span>
                                    <XIcon aria-hidden="true" className="size-6 text-white" />
                                </Button>
                            </div>
                        </TransitionChild>
                        {/* Sidebar component, swap this element with another sidebar if you like */}
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-gray-800">
                            <div className="flex h-16 shrink-0 items-center">
                                <Image alt="Taskr Logo" src={taskrLogo} className="h-8 w-auto" />
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul className="-mx-2 space-y-1">
                                            {navigation.map(item => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        aria-current={pathname.endsWith(item.href) ? "page" : undefined}
                                                        {...(pathname.endsWith(item.href) && { "data-current": "" })}
                                                        className="hover:text-indigo-600group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 data-current:bg-gray-50 data-current:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
                                                        <item.icon
                                                            aria-hidden="true"
                                                            {...(pathname.endsWith(item.href) && {
                                                                "data-current": true,
                                                            })}
                                                            className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 data-current:text-indigo-600"
                                                        />
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex h-16 shrink-0 items-center">
                        <Image alt="Taskr Logo" src={taskrLogo} className="h-8 w-auto" />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    {navigation.map(item => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                aria-current={pathname.endsWith(item.href) ? "page" : undefined}
                                                {...(pathname.endsWith(item.href) && { "data-current": "" })}
                                                className="hover:text-indigo-600group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 data-current:bg-gray-50 data-current:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
                                                <item.icon
                                                    aria-hidden="true"
                                                    {...(pathname.endsWith(item.href) && { "data-current": true })}
                                                    className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 data-current:text-indigo-600"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <div className="text-xs/6 font-semibold text-gray-400">
                                    {/*// TODO: Add section title here*/}
                                </div>
                                <ul className="-mx-2 mt-2 space-y-1">{/*// TODO: Add more links here*/}</ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                {session && (
                                    <Link
                                        href={`/dashboard/${session.user.username}/profile`}
                                        className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
                                        <Avatar
                                            name={session.user.username}
                                            url={session.user.avatarUrl}
                                            size="small"
                                        />
                                        <span className="sr-only">Your profile</span>
                                        <span aria-hidden="true">{session.user.username}</span>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-800">
                <Button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="-m-2.5 cursor-pointer p-2.5 text-gray-700 lg:hidden dark:text-gray-200">
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon aria-hidden="true" className="size-6" />
                </Button>
                <div className="flex-1 text-sm/6 font-semibold text-gray-900 dark:text-gray-200">Dashboard</div>
                {session && (
                    <Link href={`/dashboard/${session?.user.username}/profile`}>
                        <span className="sr-only">Your profile</span>
                        <Avatar name={session?.user.username} url={session?.user.avatarUrl} size="small" />
                    </Link>
                )}
            </div>
        </Fragment>
    )
}
