export default function TaskCompleteStatusBadge() {
    return (
        <span
            className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-500 dark:bg-green-700 dark:text-green-400"
            role="status"
            aria-label="Task completed">
            Completed
        </span>
    )
}
