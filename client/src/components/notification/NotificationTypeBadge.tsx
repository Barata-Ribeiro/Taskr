import { NotificationType } from "@/@types/notification"
import normalizeBadgeString from "@/utils/badge-string-normalizer"
import statusStringNormalizer from "@/utils/status-string-normalizer"
import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface NotificationTypeBadgeProps {
    type: NotificationType
}

export default function NotificationTypeBadge({ type }: Readonly<NotificationTypeBadgeProps>) {
    const textType = normalizeBadgeString(statusStringNormalizer(type))
    const defaultTypeStyle = tw`inline-block rounded-full px-2 py-1 text-xs font-medium capitalize select-none`
    const typeLabel = `Notification type: ${textType}`

    const typeColor = {
        ERROR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        WARNING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        SUCCESS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    }

    const mergedClasses = twMerge(defaultTypeStyle, typeColor[type])

    return (
        <span className={mergedClasses} role="status" aria-label={typeLabel}>
            {textType}
        </span>
    )
}
