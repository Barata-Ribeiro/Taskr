import { Fragment } from "react"

interface NoTaskAvailableProps {
    title: string
}

export default function NoTaskAvailable({ title }: NoTaskAvailableProps) {
    return (
        <Fragment>
            <h2 id={`task-group-${title}`} className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {title}
            </h2>
            <div className="block w-full min-w-0 select-none rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="block text-sm font-semibold text-gray-900">No Task Available!</span>
            </div>
        </Fragment>
    )
}
