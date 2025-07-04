import { Author } from "@/@types/user"

enum NotificationType {
    INFO = "INFO",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    ERROR = "ERROR",
}

interface Notification {
    id: number
    title: string
    message: string
    type: NotificationType
    recipient: Author
    isRead: boolean
    createdAt: string
    updatedAt: string
}

interface LatestNotifications {
    latestNotifications: Notification[]
    totalCount: number
    totalRead: number
    totalUnread: number
}

export { NotificationType }

export type { Notification, LatestNotifications }
