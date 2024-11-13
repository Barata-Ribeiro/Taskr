"use client"

import { User } from "@/interfaces/user"
import { useWebsocket } from "@/providers/websocket-provider"
import { useEffect, useState } from "react"
import { FaBell } from "react-icons/fa6"

export default function NotificationIcon({ context }: Readonly<{ context: User }>) {
    const { notifications } = useWebsocket()
    const [unreadCount, setUnreadCount] = useState(context.totalUnreadNotifications)

    useEffect(() => {
        if (notifications.length > 0) {
            const unread = notifications.filter(n => !n.isRead).length
            setUnreadCount(prevCount => prevCount + unread)
        }
    }, [notifications])

    return (
        <div>
            <button className="relative">
                <FaBell aria-hidden="true" className="h-6 w-6 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
                        {unreadCount}
                    </span>
                )}
            </button>
        </div>
    )
}
