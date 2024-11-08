import { ProjectStatus } from "@/interfaces/project"
import { getProjectStatusColor } from "@/utils/get-color-functions"
import { Fragment } from "react"
import { twMerge } from "tailwind-merge"

interface ProjectStatusBadgeProps {
    status?: ProjectStatus
    type: "text-only" | "icon-only" | "full"
}

function getStatusTextStyle(statusColor: "green" | "blue" | "gray" | "yellow" | "ebony") {
    switch (statusColor) {
        case "green":
            return "text-green-700 bg-green-50 ring-green-600/20"
        case "blue":
            return "text-blue-600 bg-blue-50 ring-blue-500/10"
        case "gray":
            return "text-gray-600 bg-gray-50 ring-gray-500/10"
        case "yellow":
            return "text-yellow-800 bg-yellow-50 ring-yellow-600/20"
        default:
            return "text-ebony-600 bg-ebony-50 ring-ebony-500/10"
    }
}

export default function ProjectStatusBadge({ status, type }: Readonly<ProjectStatusBadgeProps>) {
    if (!status || typeof status === "undefined") return null

    const statusText = status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase())

    const statusColor = getProjectStatusColor(status)

    const statusIconStyle = `text-${statusColor}-500 bg-${statusColor}-500 ring-${statusColor}-600/10`
    const statusTextStyle = getStatusTextStyle(statusColor)

    switch (type) {
        case "text-only":
            return (
                <p
                    className={twMerge(
                        "mt-0.5 select-none whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
                        statusTextStyle,
                    )}
                    aria-label={status}>
                    {statusText}
                </p>
            )
        case "icon-only":
            return (
                <span
                    aria-label={`Project Status: ${statusText}`}
                    title={`Project Status: ${statusText}`}
                    className={twMerge("flex-none rounded-full bg-opacity-10 p-1", statusIconStyle)}>
                    <div aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
                </span>
            )
        case "full":
            return (
                <Fragment>
                    <span
                        aria-hidden="true"
                        className={twMerge("flex-none rounded-full bg-opacity-10 p-1", statusIconStyle)}>
                        <div aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
                    </span>
                    <p aria-label={`Project Status: ${statusText}`} className="text-sm leading-6 text-gray-700">
                        {statusText}
                    </p>
                </Fragment>
            )
    }
}
