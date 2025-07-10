import dateToNowFormatter from "@/utils/date-to-now-formatter"
import tw from "@/utils/tw"
import { ClockIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

interface DueDateBadgeProps {
    date: string
}

export default function DueDateBadge({ date }: Readonly<DueDateBadgeProps>) {
    const isValidDate = !isNaN(Date.parse(date))
    if (!isValidDate) return <p className="text-red-500">Invalid date</p>

    const { text, status } = dateToNowFormatter(date)
    const badgeColor = {
        past: tw`bg-red-100 text-red-500 dark:bg-red-700 dark:text-red-400`,
        now: tw`bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-400`,
        future: tw`bg-green-100 text-green-500 dark:bg-green-700 dark:text-green-400`,
    }[status]

    const defaultStyles = tw`inline-flex items-center gap-x-2 rounded-full px-2 py-1 text-xs font-medium`

    const mergedClasses = twMerge(defaultStyles, badgeColor)

    return (
        <time dateTime={date} className={mergedClasses} aria-label={`Due date: ${text}`} title={`Due date: ${text}`}>
            <ClockIcon aria-hidden="true" size={16} focusable="false" />
            <span>{text}</span>
        </time>
    )
}
