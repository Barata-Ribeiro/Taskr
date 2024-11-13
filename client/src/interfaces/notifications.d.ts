import { UserContext } from "@/interfaces/user"

interface Notification {
    id: number
    title: string
    message: string
    isRead: boolean
    issuedAt: string
    readAt: string
    user: UserContext
}

export type { Notification }
