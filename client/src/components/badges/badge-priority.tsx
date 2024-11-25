import { TaskPriority } from "@/interfaces/task"
import { getTaskPriorityColor } from "@/utils/get-color-functions"
import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface BadgePriorityProps {
    priority: TaskPriority
}

export default function BadgePriority({ priority }: Readonly<BadgePriorityProps>) {
    const priorityTitle = priority.toLowerCase()

    const priorityTextColor = getTaskPriorityColor(priority)
    const priorityBgColor = getTaskPriorityColor(priority).replace(/text/, "bg").replace(/\d+/, "100")
    const fillPriorityColor = getTaskPriorityColor(priority).replace(/text/, "fill").replace(/\d+/, "500")

    const wrapperStyles = tw`inline-flex select-none items-center gap-x-1.5 rounded-full px-2 py-1 font-heading text-xs font-medium capitalize`
    const wrapperMergedStyles = twMerge(wrapperStyles, priorityBgColor, priorityTextColor)

    const circleMergedStyles = twMerge("h-1.5 w-1.5", fillPriorityColor)

    return (
        <span className={wrapperMergedStyles} title={`Priority: ${priorityTitle}`}>
            <svg viewBox="0 0 6 6" aria-hidden="true" className={circleMergedStyles}>
                <circle r={3} cx={3} cy={3} />
            </svg>
            {priorityTitle}
        </span>
    )
}
