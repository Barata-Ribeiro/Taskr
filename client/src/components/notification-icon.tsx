"use client"

import Avatar from "@/components/helpers/avatar"
import { User } from "@/interfaces/user"
import { useWebsocket } from "@/providers/websocket-provider"
import tw from "@/utils/tw"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaBell } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

interface NotificationIconProps {
    context: User
    type?: "avatar" | "avatar-plus-name"
}

export default function NotificationIcon({ context, type }: Readonly<NotificationIconProps>) {
    const { notifications } = useWebsocket()
    const [unreadCount, setUnreadCount] = useState(context.totalUnreadNotifications)

    useEffect(() => {
        if (notifications.length > 0) {
            const unread = notifications.filter(n => !n.read).length
            setUnreadCount(prevCount => prevCount + unread)
        }
    }, [notifications])

    const unreadCounterBaseStyles = tw`absolute bottom-auto left-0 right-auto top-0 z-10 inline-block -translate-y-1/3 translate-x-3 rotate-0 skew-x-0 skew-y-0 scale-x-75 scale-y-75 select-none whitespace-nowrap rounded-full px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white`

    const unreadCounterForAvatarsBaseStyles = tw`absolute bottom-auto left-0 right-auto top-0 z-10 inline-block -translate-y-1/3 translate-x-4 rotate-0 skew-x-0 skew-y-0 scale-x-75 scale-y-75 select-none whitespace-nowrap rounded-full px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white`

    switch (type) {
        case "avatar":
            return (
                <Link
                    href="/dashboard/profile"
                    className="relative"
                    aria-label="Go to your profile settings"
                    title="Go to your profile settings">
                    <span className="sr-only">Your profile</span>
                    <Avatar name={context.fullName ?? context.displayName} size={32} src={context.avatarUrl} />
                    {unreadCount > 0 && (
                        <span
                            aria-label={`You have ${unreadCount} unread notifications`}
                            title={`You have ${unreadCount} unread notifications`}
                            className={twMerge(
                                unreadCounterForAvatarsBaseStyles,
                                unreadCount === 0 ? "bg-neutral-600" : "bg-english-holly-600",
                            )}>
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Link>
            )
        case "avatar-plus-name":
            return (
                <Link
                    href="/dashboard/profile"
                    aria-label="Go to your profile settings"
                    title="Go to your profile settings"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                    <div className="relative">
                        <Avatar name={context.fullName ?? context.displayName} size={32} src={context.avatarUrl} />
                        {unreadCount > 0 && (
                            <span
                                aria-label={`You have ${unreadCount} unread notifications`}
                                title={`You have ${unreadCount} unread notifications`}
                                className={twMerge(
                                    unreadCounterForAvatarsBaseStyles,
                                    unreadCount === 0 ? "bg-neutral-600" : "bg-english-holly-600",
                                )}>
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </div>
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">{context.fullName}</span>
                </Link>
            )
        default:
            return (
                <Link
                    href="/dashboard/profile/notifications"
                    className="relative order-1 rounded-full bg-ebony-50 p-1 text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-default disabled:opacity-50 sm:order-2"
                    aria-label="View notifications"
                    title="View notifications">
                    <FaBell aria-hidden="true" className="h-5 w-5 text-ebony-500" />
                    {unreadCount > 0 && (
                        <span
                            aria-label={`You have ${unreadCount} unread notifications`}
                            title={`You have ${unreadCount} unread notifications`}
                            className={twMerge(
                                unreadCounterBaseStyles,
                                unreadCount === 0 ? "bg-neutral-600" : "bg-english-holly-600",
                            )}>
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Link>
            )
    }
}
