"use client"

import NavLogo from "@/components/shared/NavLogo"
import DefaultButton from "@/components/ui/DefaultButton"
import SidebarSkeleton from "@/components/ui/skeletons/SidebarSkeleton"
import UserMenu from "@/components/UserMenu"
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react"
import { ChartPieIcon, FolderIcon, HomeIcon, InboxIcon, MenuIcon, XIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, useState } from "react"

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { data: session, status } = useSession()
    const pathname = usePathname()

    if (status === "loading") return <SidebarSkeleton />

    const basePath = `/dashboard/${session?.user.username}`

    const navigation = [
        { name: "Dashboard", href: `${basePath}`, icon: HomeIcon },
        { name: "Notifications", href: `${basePath}/notifications`, icon: InboxIcon },
        { name: "Projects", href: `${basePath}/projects`, icon: FolderIcon },
        { name: "Reports", href: `${basePath}/reports`, icon: ChartPieIcon },
    ]

    return (
        <Fragment>
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-999 lg:hidden">
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
                                <DefaultButton
                                    buttonType="ghost"
                                    onClick={() => setSidebarOpen(false)}
                                    width="fit"
                                    isIconOnly
                                    aria-label="Close sidebar">
                                    <XIcon aria-hidden size={24} />
                                </DefaultButton>
                            </div>
                        </TransitionChild>

                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white p-6 dark:bg-gray-800">
                            <NavLogo />

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
                                                        onClick={() => setSidebarOpen(false)}
                                                        className="hover:text-indigo-600group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 data-current:bg-gray-50 data-current:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
                                                        <item.icon
                                                            aria-hidden
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
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <NavLogo />

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
                                                className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 data-current:bg-gray-50 data-current:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
                                                <item.icon
                                                    aria-hidden
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

                            <li className="mt-auto dark:border-gray-700">
                                <UserMenu anchor="bottom end" />
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="sticky top-0 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-800">
                <DefaultButton
                    onClick={() => setSidebarOpen(true)}
                    width="fit"
                    buttonType="ghost"
                    isIconOnly
                    aria-label="Open sidebar"
                    aria-haspopup="true">
                    <MenuIcon aria-hidden size={24} />
                </DefaultButton>

                <div className="flex-1 text-sm/6 font-semibold text-gray-900 dark:text-gray-200">Dashboard</div>

                <UserMenu anchor="bottom end" isAvatarOnly />
            </div>
        </Fragment>
    )
}
