"use client"

import Avatar from "@/components/helpers/avatar"
import SessionVerifier from "@/components/helpers/session-verifier"
import { UserContext } from "@/interfaces/user"
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ReactNode, useState } from "react"
import { FaHome } from "react-icons/fa"
import { FaBars, FaBuilding, FaFolder, FaX } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"
import taskrLogo from "../../public/images/logo.svg"

interface SidebarProps {
    data: UserContext
    children: ReactNode
}

export default function Sidebar({ data, children }: Readonly<SidebarProps>) {
    const pathname = usePathname()

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: FaHome, current: pathname.endsWith("/dashboard") },
        {
            name: "Organizations",
            href: "/dashboard/organizations",
            icon: FaBuilding,
            current: pathname.endsWith("/organizations"),
        },
        { name: "Projects", href: "/dasboard/projects", icon: FaFolder, current: pathname.endsWith("/projects") },
    ]
    const projects =
        data.projectsWhereUserIsMember?.map(project => ({
            name: project.name,
            href: `/dashboard/projects/${project.id}`,
            initial: project.name.charAt(0).toUpperCase(),
            current: pathname.endsWith(`/projects/${project.id}`),
        })) ?? []

    const organizations =
        data.organizationsWhereUserIsMember?.map(organization => ({
            name: organization.name,
            href: `/dashboard/organizations/${organization.id}`,
            initial: organization.name.charAt(0).toUpperCase(),
            current: pathname.endsWith(`/organization/${organization.id}`),
        })) ?? []

    return (
        <aside>
            <SessionVerifier />
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full">
                        <TransitionChild>
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                    <span className="sr-only">Close sidebar</span>
                                    <FaX aria-hidden="true" className="h-6 w-6 text-white" />
                                </button>
                            </div>
                        </TransitionChild>
                        {/* Sidebar component */}
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                            <div className="flex h-16 shrink-0 items-center">
                                <Image alt="Taskr Logo" src={taskrLogo} className="mx-auto h-8 w-auto" priority />
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul role="list" className="-mx-2 space-y-1">
                                            {navigation.map(item => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={twMerge(
                                                            item.current
                                                                ? "bg-gray-50 text-indigo-600"
                                                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                        )}>
                                                        <item.icon
                                                            aria-hidden="true"
                                                            className={twMerge(
                                                                item.current
                                                                    ? "text-indigo-600"
                                                                    : "text-gray-400 group-hover:text-indigo-600",
                                                                "h-6 w-6 shrink-0",
                                                            )}
                                                        />
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li>
                                        <div className="text-xs font-semibold leading-6 text-gray-400">
                                            Projects ({data.totalProjectsWhereUserIsMember})
                                        </div>
                                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                                            {projects.length > 0 &&
                                                projects.map(project => (
                                                    <li key={project.name}>
                                                        <Link
                                                            href={project.href}
                                                            className={twMerge(
                                                                project.current
                                                                    ? "bg-gray-50 text-indigo-600"
                                                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                            )}>
                                                            <span
                                                                className={twMerge(
                                                                    project.current
                                                                        ? "border-indigo-600 text-indigo-600"
                                                                        : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                                                                )}>
                                                                {project.initial}
                                                            </span>
                                                            <span className="truncate">{project.name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                        </ul>
                                    </li>
                                    <li>
                                        <div className="text-xs font-semibold leading-6 text-gray-400">
                                            Organizations ({data.totalOrganizationsWhereUserIsMember})
                                        </div>
                                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                                            {organizations.length > 0 &&
                                                organizations.map(organization => (
                                                    <li key={organization.name}>
                                                        <Link
                                                            href={organization.href}
                                                            className={twMerge(
                                                                organization.current
                                                                    ? "bg-gray-50 text-indigo-600"
                                                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                            )}>
                                                            <span
                                                                className={twMerge(
                                                                    organization.current
                                                                        ? "border-indigo-600 text-indigo-600"
                                                                        : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                                                                )}>
                                                                {organization.initial}
                                                            </span>
                                                            <span className="truncate">{organization.name}</span>
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
                {/* Sidebar component */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <Image alt="Taskr Logo" src={taskrLogo} className="mx-auto h-10 w-auto" priority />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map(item => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={twMerge(
                                                    item.current
                                                        ? "bg-gray-50 text-indigo-600"
                                                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                )}>
                                                <item.icon
                                                    aria-hidden="true"
                                                    className={twMerge(
                                                        item.current
                                                            ? "text-indigo-600"
                                                            : "text-gray-400 group-hover:text-indigo-600",
                                                        "h-6 w-6 shrink-0",
                                                    )}
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <div className="text-xs font-semibold leading-6 text-gray-400">
                                    Projects ({data.totalProjectsWhereUserIsMember})
                                </div>
                                <ul role="list" className="-mx-2 mt-2 space-y-1">
                                    {projects.length > 0 &&
                                        projects.map(project => (
                                            <li key={project.name}>
                                                <Link
                                                    href={project.href}
                                                    className={twMerge(
                                                        project.current
                                                            ? "bg-gray-50 text-indigo-600"
                                                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                    )}>
                                                    <span
                                                        className={twMerge(
                                                            project.current
                                                                ? "border-indigo-600 text-indigo-600"
                                                                : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                                                        )}>
                                                        {project.initial}
                                                    </span>
                                                    <span className="truncate">{project.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                            <li>
                                <div className="text-xs font-semibold leading-6 text-gray-400">
                                    Organizations ({data.totalOrganizationsWhereUserIsMember})
                                </div>
                                <ul role="list" className="-mx-2 mt-2 space-y-1">
                                    {organizations.length > 0 &&
                                        organizations.map(organization => (
                                            <li key={organization.name}>
                                                <Link
                                                    href={organization.href}
                                                    className={twMerge(
                                                        organization.current
                                                            ? "bg-gray-50 text-indigo-600"
                                                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                                    )}>
                                                    <span
                                                        className={twMerge(
                                                            organization.current
                                                                ? "border-indigo-600 text-indigo-600"
                                                                : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                                                        )}>
                                                        {organization.initial}
                                                    </span>
                                                    <span className="truncate">{organization.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                                    <Avatar
                                        name={data.context.fullName ?? data.context.displayName}
                                        size={32}
                                        src={data.context.avatarUrl}
                                    />
                                    <span className="sr-only">Your profile</span>
                                    <span aria-hidden="true">{data.context.fullName}</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                    <span className="sr-only">Open sidebar</span>
                    <FaBars aria-hidden="true" className="h-6 w-6" />
                </button>
                <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
                <Link href="/dashboard/profile">
                    <span className="sr-only">Your profile</span>
                    <Avatar
                        name={data.context.fullName ?? data.context.displayName}
                        size={32}
                        src={data.context.avatarUrl}
                    />
                </Link>
            </div>

            <main className="py-10 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
        </aside>
    )
}
