export default function dateFormatter(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    }
    const formatter = new Intl.DateTimeFormat("en-US", options)
    const parts = formatter.formatToParts(new Date(date))
    return parts
        .map(part => part.value)
        .join()
        .replace(/,/g, "")
        .trim()
}
