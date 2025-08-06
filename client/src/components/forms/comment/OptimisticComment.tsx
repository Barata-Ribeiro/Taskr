import SafeMarkdown from "@/components/shared/SafeMarkdown"
import dateFormatter from "@/utils/date-formatter"
import dateToNowFormatter from "@/utils/date-to-now-formatter"

export default function OptimisticNewComment({ content }: Readonly<{ content: string }>) {
    return (
        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="inline-flex gap-x-2 divide-x divide-gray-200 dark:divide-gray-700">
                <time
                    dateTime={new Date().toISOString()}
                    className="block pr-2 text-xs text-gray-500 dark:text-gray-400">
                    {dateFormatter(new Date().toISOString())}
                </time>

                <p className="block text-xs text-gray-300 dark:text-gray-500">
                    {dateToNowFormatter(new Date().toISOString()).text}
                </p>
            </div>

            <div className="mt-2 max-h-52 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                <SafeMarkdown markdown={content} />
            </div>
        </div>
    )
}
