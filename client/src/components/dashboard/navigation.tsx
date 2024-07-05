"use client"
import LinkButton from "@/components/general/link-button"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { usePathname } from "next/navigation"
import { Fragment, useState } from "react"
import { FaHome } from "react-icons/fa"
import { FaBars, FaDochub, FaFolder, FaUsers, FaX } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

export default function Navigation() {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const user = {
        name: "Tom Cook",
        email: "tom@example.com",
        imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    }

    const encodedName = encodeURIComponent(user.name)

    const navigation = [
        { name: "Dashboard", href: "/dashboard/" + encodedName, icon: FaHome },
        {
            name: "Organization",
            href: "/dashboard/" + encodedName + "/organization",
            icon: FaUsers,
        },
        {
            name: "Projects",
            href: "/dashboard/" + encodedName + "/projects",
            icon: FaFolder,
        },
        {
            name: "Reports",
            href: "/dashboard/" + encodedName + "/reports",
            icon: FaDochub,
        },
    ]

    const teams = [
        { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
        { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
        { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
    ]

    // @ts-ignore
    return (
        <Fragment>
            <Transition show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <TransitionChild
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex">
                        <TransitionChild
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full">
                            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <TransitionChild
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0">
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() => setSidebarOpen(false)}>
                                            <span className="sr-only">Close sidebar</span>
                                            <FaX className="h-6 w-6 text-background-50" aria-hidden="true" />
                                        </button>
                                    </div>
                                </TransitionChild>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background-600 px-6 pb-2">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <h1 className="mx-auto w-max select-none bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-background-200 via-background-300 to-background-400 bg-clip-text font-heading text-3xl font-bold leading-none tracking-wider text-transparent transition-colors duration-200 ease-in-out">
                                            TASkR
                                        </h1>
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul className="-mx-2 space-y-1">
                                                    {navigation.map(item => (
                                                        <li key={item.name}>
                                                            <LinkButton
                                                                href={item.href}
                                                                className={twMerge(
                                                                    pathname.endsWith(item.href)
                                                                        ? "bg-background-700 text-white"
                                                                        : "text-body-200 hover:bg-body-700 hover:text-body-50",
                                                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                                )}>
                                                                {item.icon && (
                                                                    <item.icon
                                                                        className={twMerge(
                                                                            pathname.endsWith(item.href)
                                                                                ? "text-body-50"
                                                                                : "text-body-200 group-hover:text-body-50",
                                                                            "h-6 w-6 shrink-0",
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                {item.name}
                                                            </LinkButton>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                            <li>
                                                <div className="text-xs font-semibold leading-6 text-body-200">
                                                    Your teams
                                                </div>
                                                <ul className="-mx-2 mt-2 space-y-1">
                                                    {teams.map(team => (
                                                        <li key={team.name}>
                                                            <a
                                                                href={team.href}
                                                                className={twMerge(
                                                                    team.current
                                                                        ? "bg-background-700 text-body-50"
                                                                        : "text-body-200 hover:bg-background-700 hover:text-body-50",
                                                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                                )}>
                                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                                                    {team.initial}
                                                                </span>
                                                                <span className="truncate">{team.name}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background-600 px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <h1 className="mx-auto w-max select-none bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-background-200 via-background-300 to-background-400 bg-clip-text font-heading text-3xl font-bold leading-none tracking-wider text-transparent transition-colors duration-200 ease-in-out">
                            TASkR
                        </h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    {navigation.map(item => (
                                        <li key={item.name}>
                                            <LinkButton
                                                href={item.href}
                                                className={twMerge(
                                                    pathname.endsWith(item.href)
                                                        ? "bg-background-700 text-body-50"
                                                        : "text-body-200 hover:bg-background-700 hover:text-body-50",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                )}>
                                                {item.icon && (
                                                    <item.icon
                                                        className={twMerge(
                                                            pathname.endsWith(item.href)
                                                                ? "text-body-50"
                                                                : "text-body-200 group-hover:text-body-50",
                                                            "h-6 w-6 shrink-0",
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {item.name}
                                            </LinkButton>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <div className="text-xs font-semibold leading-6 text-body-200">Your teams</div>
                                <ul className="-mx-2 mt-2 space-y-1">
                                    {teams.map(team => (
                                        <li key={team.name}>
                                            <a
                                                href={team.href}
                                                className={twMerge(
                                                    team.current
                                                        ? "bg-background-700 text-white"
                                                        : "text-body-200 hover:bg-background-700 hover:text-body-50",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                )}>
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                                    {team.initial}
                                                </span>
                                                <span className="truncate">{team.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                <LinkButton
                                    href="#"
                                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-indigo-700">
                                    <img
                                        className="h-8 w-8 rounded-full bg-indigo-700"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                    <span className="sr-only">Your profile</span>
                                    <span aria-hidden="true">Tom Cook</span>
                                </LinkButton>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-background-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-body-200 lg:hidden"
                    onClick={() => setSidebarOpen(true)}>
                    <span className="sr-only">Open sidebar</span>
                    <FaBars className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex-1 text-sm font-semibold leading-6 text-body-50">Dashboard</div>
                <LinkButton href="#">
                    <span className="sr-only">Your profile</span>
                    <img
                        className="h-8 w-8 rounded-full bg-background-700"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                </LinkButton>
            </div>
        </Fragment>
    )
}
