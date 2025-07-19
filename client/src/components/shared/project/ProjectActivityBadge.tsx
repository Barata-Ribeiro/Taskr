import { ActivityType } from "@/@types/activity"
import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface ProjectActivityBadgeProps {
    action: ActivityType
}

export default function ProjectActivityBadge({ action }: Readonly<ProjectActivityBadgeProps>) {
    function actionColor(action: ActivityType): string {
        switch (action) {
            case ActivityType.CREATE_PROJECT:
            case ActivityType.ADD_TASK:
            case ActivityType.COMPLETE_TASK:
            case ActivityType.ADD_MEMBER:
                return "bg-green-100 text-green-800"
            case ActivityType.UPDATE_PROJECT:
            case ActivityType.UPDATE_TASK:
            case ActivityType.UPDATE_COMMENT:
                return "bg-yellow-100 text-yellow-800"
            case ActivityType.DELETE_PROJECT:
            case ActivityType.DELETE_TASK:
            case ActivityType.DELETE_COMMENT:
            case ActivityType.REMOVE_MEMBER:
                return "bg-red-100 text-red-800"
            case ActivityType.ASSIGN_TASK:
            case ActivityType.REOPEN_TASK:
                return "bg-blue-100 text-blue-800"
            case ActivityType.UNASSIGN_TASK:
                return "bg-orange-100 text-orange-800"
            case ActivityType.ADD_COMMENT:
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const formattedAction = action.replace(/_/g, " ").toLowerCase()

    const defaultStyles = tw`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize select-none`

    return (
        <span className={twMerge(defaultStyles, actionColor(action))} aria-label={formattedAction}>
            {formattedAction}
        </span>
    )
}
