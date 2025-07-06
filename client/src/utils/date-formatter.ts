interface DateFormatterOptions {
    dateStyle?: Intl.DateTimeFormatOptions["dateStyle"]
    timeStyle?: Intl.DateTimeFormatOptions["timeStyle"]
}

export default function dateFormatter(
    date: string,
    { dateStyle, timeStyle }: Readonly<DateFormatterOptions> = {},
): string {
    const convertedDate = new Date(date)

    const options: Intl.DateTimeFormatOptions = {
        dateStyle: dateStyle ?? "medium",
        timeStyle: timeStyle ?? "short",
    }

    return new Intl.DateTimeFormat("en-US", options).format(convertedDate)
}
