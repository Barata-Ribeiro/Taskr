import { ActivityType } from "@/@types/activity"
import {
    CheckCircleIcon,
    EditIcon,
    FolderOpenIcon,
    GitBranchIcon,
    MessageSquareIcon,
    PlusIcon,
    RefreshCwIcon,
    Trash2Icon,
    UserMinusIcon,
    UserPlusIcon,
} from "lucide-react"

interface ProjectActivityIconProps {
    action: ActivityType
}

export default function ProjectActivityIcon({ action }: Readonly<ProjectActivityIconProps>) {
    switch (action) {
        case ActivityType.CREATE_PROJECT:
            return <FolderOpenIcon aria-hidden className="size-4 text-blue-600" />
        case ActivityType.UPDATE_PROJECT:
            return <EditIcon aria-hidden className="size-4 text-yellow-600" />
        case ActivityType.DELETE_PROJECT:
            return <Trash2Icon aria-hidden className="size-4 text-red-600" />
        case ActivityType.ADD_TASK:
            return <PlusIcon aria-hidden className="size-4 text-green-600" />
        case ActivityType.UPDATE_TASK:
            return <EditIcon aria-hidden className="size-4 text-yellow-600" />
        case ActivityType.DELETE_TASK:
            return <Trash2Icon aria-hidden className="size-4 text-red-600" />
        case ActivityType.ASSIGN_TASK:
            return <UserPlusIcon aria-hidden className="size-4 text-blue-600" />
        case ActivityType.UNASSIGN_TASK:
            return <UserMinusIcon aria-hidden className="size-4 text-orange-600" />
        case ActivityType.COMPLETE_TASK:
            return <CheckCircleIcon aria-hidden className="size-4 text-green-600" />
        case ActivityType.REOPEN_TASK:
            return <RefreshCwIcon aria-hidden className="size-4 text-blue-600" />
        case ActivityType.ADD_COMMENT:
            return <MessageSquareIcon aria-hidden className="size-4 text-purple-600" />
        case ActivityType.UPDATE_COMMENT:
            return <EditIcon aria-hidden className="size-4 text-yellow-600" />
        case ActivityType.DELETE_COMMENT:
            return <Trash2Icon aria-hidden className="size-4 text-red-600" />
        case ActivityType.ADD_MEMBER:
            return <UserPlusIcon aria-hidden className="size-4 text-green-600" />
        case ActivityType.REMOVE_MEMBER:
            return <UserMinusIcon aria-hidden className="size-4 text-red-600" />
        default:
            return <GitBranchIcon aria-hidden className="size-4 text-gray-600" />
    }
}
