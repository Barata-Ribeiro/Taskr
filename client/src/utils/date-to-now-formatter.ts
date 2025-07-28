export type DateToNowStatus = "past" | "now" | "future"

export interface DateToNowResult {
    text: string
    status: DateToNowStatus
}

export default function dateToNowFormatter(date: string): DateToNowResult {
    const now = new Date()
    const target = new Date(date)
    const diffMs = target.getTime() - now.getTime()
    const absMs = Math.abs(diffMs)

    const diffMinutes = Math.floor(absMs / (1000 * 60))
    const diffHours = Math.floor(absMs / (1000 * 60 * 60))
    const diffDays = Math.floor(absMs / (1000 * 60 * 60 * 24))

    let status: DateToNowStatus
    if (diffMs > 0) status = "future"
    else if (diffMs < 0) status = "past"
    else return { text: "Just now", status: "now" }

    switch (status) {
        case "future":
            if (diffDays > 1) return { text: `${diffDays} days from now`, status }
            if (diffDays === 1) return { text: "Tomorrow", status }
            if (diffHours > 1) return { text: `${diffHours} hours from now`, status }
            if (diffHours === 1) return { text: "In an hour", status }
            if (diffMinutes > 1) return { text: `${diffMinutes} minutes from now`, status }
            if (diffMinutes === 1) return { text: "In a minute", status }
            return { text: "Just now", status: "now" }
        case "past":
            if (diffDays > 1) return { text: `${diffDays} days ago`, status }
            if (diffDays === 1) return { text: "Yesterday", status }
            if (diffHours > 1) return { text: `${diffHours} hours ago`, status }
            if (diffHours === 1) return { text: "An hour ago", status }
            if (diffMinutes > 1) return { text: `${diffMinutes} minutes ago`, status }
            if (diffMinutes === 1) return { text: "A minute ago", status }
            return { text: "Just now", status: "now" }
        default:
            return { text: "Invalid date", status: "now" }
    }
}
