interface NotificationReadBadgeProps {
    isRead: boolean
}

function getReadBadge() {
    return (
        <span className="inline-flex select-none items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Read
        </span>
    )
}

function getUnreadBadge() {
    return (
        <span className="inline-flex select-none items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Unread
        </span>
    )
}

export default function NotificationReadBadge({ isRead }: Readonly<NotificationReadBadgeProps>) {
    return isRead ? getReadBadge() : getUnreadBadge()
}
