type DateFormatterOptions = {
    verbose?: boolean
}

export default function dateFormatter(date: string, options?: DateFormatterOptions): string {
    const d = new Date(date)
    if (options?.verbose) {
        const day = d.getDate()
        const daySuffix = (n: number) => {
            if (n >= 11 && n <= 13) return "th"
            switch (n % 10) {
                case 1:
                    return "st"
                case 2:
                    return "nd"
                case 3:
                    return "rd"
                default:
                    return "th"
            }
        }
        const month = d.toLocaleString("en-US", { month: "long" })
        const year = d.getFullYear()
        let hour = d.getHours()
        const minute = d.getMinutes().toString().padStart(2, "0")
        const ampm = hour >= 12 ? "PM" : "AM"
        hour = hour % 12 || 12
        return `${month} ${day}${daySuffix(day)}, ${year} at ${hour}:${minute} ${ampm}`
    } else {
        const formatOptions: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
        }
        const formatter = new Intl.DateTimeFormat("en-US", formatOptions)
        const parts = formatter.formatToParts(d)
        return parts
            .map(part => part.value)
            .join("")
            .replace(/,/g, "")
            .trim()
    }
}
