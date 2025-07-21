import { Notification } from "@/@types/notification"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultCheckbox from "@/components/ui/DefaultCheckbox"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import dateFormatter from "@/utils/date-formatter"
import { EyeIcon, MailIcon, MailOpenIcon, Trash2Icon } from "lucide-react"
import { useSession } from "next-auth/react"
import { type ChangeEvent } from "react"

interface NotificationRowProps {
    notification: Notification
    selectedNotifications: Notification[]
    setSelectedNotifications: (notifications: Notification[]) => void
    toggleRead: (notification: Notification) => void
    deleteNotif: (notification: Notification) => void
}

export default function NotificationRow({
    notification,
    selectedNotifications,
    setSelectedNotifications,
    toggleRead,
    deleteNotif,
}: Readonly<NotificationRowProps>) {
    const { data: session } = useSession()
    const isSelected = selectedNotifications.includes(notification)
    const isRead = notification.read
    const formattedDate = dateFormatter(notification.createdAt)
    const notificationUrl = `/dashboard/${session?.user.username}/notifications/${notification.id}`
    const notificationLabel = `View notification '${notification.title}'`
    const notificationStatusLabel = `Mark notification as ${notification.read ? "unread" : "read"}`

    function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
        setSelectedNotifications(
            e.target.checked
                ? [...selectedNotifications, notification]
                : selectedNotifications.filter(p => p !== notification),
        )
    }

    const notificationDeleteLabel = `Delete notification '${notification.title}'`
    return (
        <tr
            {...(isSelected && { "data-selected": "" })}
            {...(isRead && { "data-read": "" })}
            className="border-b border-gray-200 bg-white font-bold hover:bg-gray-50 data-read:bg-indigo-50 data-read:font-normal data-selected:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600 data-read:dark:bg-indigo-950 dark:data-selected:bg-gray-800">
            <td className="relative w-4 p-4">
                {isSelected && <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />}
                <DefaultCheckbox
                    value={notification.id}
                    checked={selectedNotifications.includes(notification)}
                    onChange={handleCheckboxChange}
                />
            </td>

            <td
                {...(isSelected && { "data-selected": "" })}
                {...(isRead && { "data-read": "" })}
                className="inline-flex items-center gap-x-2 px-6 py-4 whitespace-nowrap data-selected:text-green-600 dark:data-selected:text-green-500">
                {isRead ? <MailOpenIcon aria-hidden className="size-4" /> : <MailIcon aria-hidden className="size-4" />}
                {notification.title}
            </td>

            <td style={{ scrollbarWidth: "thin" }} className="max-w-2xl overflow-x-auto px-6 py-4 whitespace-nowrap">
                {notification.message}
            </td>

            <td className="px-6 py-4 whitespace-nowrap capitalize">{notification.type.toLowerCase()}</td>

            <td className="px-6 py-4 whitespace-nowrap">
                <time
                    dateTime={new Date(notification.createdAt).toISOString()}
                    aria-label={`Notification sent on ${formattedDate}`}
                    title={`Notification sent on ${formattedDate}`}>
                    {formattedDate}
                </time>
            </td>

            <td className="inline-flex items-center justify-center gap-x-3 px-6 py-4 whitespace-nowrap">
                <DefaultLinkButton
                    buttonType="ghost"
                    width="fit"
                    isIconOnly
                    href={notificationUrl}
                    aria-label={notificationLabel}
                    title={notificationLabel}>
                    <EyeIcon aria-hidden size={16} />
                </DefaultLinkButton>

                <DefaultButton
                    buttonType="ghost"
                    width="fit"
                    isIconOnly
                    onClick={() => toggleRead(notification)}
                    aria-label={notificationStatusLabel}
                    title={notificationStatusLabel}>
                    {notification.read ? <MailIcon aria-hidden size={16} /> : <MailOpenIcon aria-hidden size={16} />}
                </DefaultButton>

                <DefaultButton
                    buttonType="ghost"
                    width="fit"
                    isIconOnly
                    onClick={() => deleteNotif(notification)}
                    aria-label={notificationDeleteLabel}
                    title={notificationDeleteLabel}>
                    <Trash2Icon aria-hidden size={16} />
                </DefaultButton>
            </td>
        </tr>
    )
}
