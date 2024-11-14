import { UserContext } from "@/interfaces/user"

interface Notification {
    id: number
    title: string
    message: string
    read: boolean
    issuedAt: string
    readAt: string
    user: UserContext
}

export type { Notification }
