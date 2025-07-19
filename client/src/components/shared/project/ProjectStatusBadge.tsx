import { ProjectStatus } from "@/@types/project"
import tw from "@/utils/tw"
import { CheckCircleIcon, ClockIcon, PauseIcon, PlayIcon, XIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

interface ProjectStatusProps {
    status: ProjectStatus
    type: "icon" | "text"
}

export default function ProjectStatusBadge({ status, type }: Readonly<ProjectStatusProps>) {
    const statusIconStyles = {
        NOT_STARTED: tw`size-4 text-gray-600`,
        IN_PROGRESS: tw`size-4 text-blue-600`,
        COMPLETED: tw`size-4 text-green-600`,
        ON_HOLD: tw`size-4 text-yellow-600`,
        CANCELLED: tw`size-4 text-red-600`,
    }
    const statusIcon = {
        NOT_STARTED: <ClockIcon className={statusIconStyles.NOT_STARTED} />,
        IN_PROGRESS: <PlayIcon className={statusIconStyles.IN_PROGRESS} />,
        COMPLETED: <CheckCircleIcon className={statusIconStyles.COMPLETED} />,
        ON_HOLD: <PauseIcon className={statusIconStyles.ON_HOLD} />,
        CANCELLED: <XIcon className={statusIconStyles.CANCELLED} />,
    }

    const statusColor = {
        NOT_STARTED: "bg-gray-100 text-gray-800",
        IN_PROGRESS: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        ON_HOLD: "bg-yellow-100 text-yellow-800",
        CANCELLED: "bg-red-100 text-red-800",
    }

    const defaultStyles = tw`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize select-none`
    const statusNormalized = status.replace(/_/g, " ").toLowerCase()
    const statusLabel = `Project status: ${statusNormalized.replace(/\b\w/g, char => char.toUpperCase())}`

    return type === "icon" ? (
        statusIcon[status]
    ) : (
        <span
            className={twMerge(defaultStyles, statusColor[status])}
            role="status"
            aria-label={statusLabel}
            title={statusLabel}>
            {statusNormalized}
        </span>
    )
}
