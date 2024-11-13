"use client"

import { User } from "@/interfaces/user"
import { useWebsocket } from "@/providers/websocket-provider"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaBell } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

export default function NotificationIcon({ context }: Readonly<{ context: User }>) {
    const { notifications } = useWebsocket()
    const [unreadCount, setUnreadCount] = useState(context.totalUnreadNotifications)

    useEffect(() => {
        if (notifications.length > 0) {
            const unread = notifications.filter(n => !n.isRead).length
            setUnreadCount(prevCount => prevCount + unread)
        }
    }, [notifications])

    const unreadCounterBaseStyles =
        "absolute bottom-auto left-0 right-auto top-0 z-10 inline-block -translate-y-1/3 translate-x-1.5 rotate-0 skew-x-0 skew-y-0 scale-x-75 scale-y-75 select-none whitespace-nowrap rounded-full px-2.5 py-1 text-center align-baseline text-xs font-bold leading-none text-white"

    return (
        <Link
            href="/dashboard/profile/notifications"
            className="relative rounded-full bg-ebony-50 p-1 text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-default disabled:opacity-50"
            aria-label="View notifications"
            title="View notifications">
            <FaBell aria-hidden="true" className="h-5 w-5 text-ebony-500" />
            {unreadCount > 0 && (
                <span
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
