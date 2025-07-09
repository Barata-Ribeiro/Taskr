interface TooltipProps {
    content: string
}

export default function Tooltip({ content }: Readonly<TooltipProps>) {
    return (
        <div
            aria-hidden
            className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 transform rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white group-hover:block dark:bg-gray-600"
            style={{ whiteSpace: "nowrap" }}>
            <span className="absolute top-3/4 left-1/2 size-2.5 -translate-x-1/2">
                <span className="block size-2.5 rotate-45 bg-gray-800 dark:bg-gray-600"></span>
            </span>

            {content}
        </div>
    )
}
