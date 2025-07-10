import { Task } from "@/@types/task"
import Tooltip from "@/components/shared/Tooltip"
import Avatar from "@/components/user/Avatar"
import tw from "@/utils/tw"
import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

interface TaskCardProps {
    baseUrl: string
    provided: DraggableProvided
    snapshot: DraggableStateSnapshot
    task: Task
}

export default function TaskCard({ baseUrl, provided, snapshot, task }: Readonly<TaskCardProps>) {
    function getDraggableClasses(snapshot: DraggableStateSnapshot): string {
        const baseStyle = tw`grid !cursor-move gap-2 rounded-lg bg-white p-4 shadow-sm transition-transform hover:shadow-md dark:bg-gray-800 dark:hover:shadow-lg`
        const isDragging = snapshot.isDragging

        let animationStyle: string | undefined
        if (snapshot.dropAnimation) {
            const { moveTo, curve, duration } = snapshot.dropAnimation
            animationStyle = moveTo ? tw`transition-all duration-[${duration}ms] ease-[${curve}]` : undefined
        }

        const draggingStyle = isDragging ? "shadow-lg transform scale-105" : undefined

        return twMerge(baseStyle, animationStyle, draggingStyle)
    }

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={getDraggableClasses(snapshot)}>
            <h3 className="text-lg font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>

            <div className="flex items-center justify-between gap-4">
                <div className="flex -space-x-2">
                    {[...Array(3)].flatMap((_, i) =>
                        task.assignees.map(assignee => {
                            const key = `${assignee.id}-${i}`
                            const href = `${baseUrl}/profile/${assignee.username}`

                            return (
                                <Link
                                    key={key}
                                    href={href}
                                    aria-label={`View profile of ${assignee.displayName}`}
                                    className="group relative">
                                    <Avatar url={assignee.avatarUrl} name={assignee.displayName} size="extra-small" />
                                    <Tooltip content={assignee.displayName} />
                                </Link>
                            )
                        }),
                    )}
                </div>
            </div>
        </div>
    )
}
