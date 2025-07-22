import { Task } from "@/@types/task"
import EditTaskModal from "@/components/modals/EditTaskModal"
import DueDateBadge from "@/components/shared/task/DueDateBadge"
import Tooltip from "@/components/shared/Tooltip"
import TaskPriorityBadge from "@/components/task/TaskPriorityBadge"
import Avatar from "@/components/user/Avatar"
import tw from "@/utils/tw"
import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd"
import Link from "next/link"
import { Fragment } from "react"
import { twMerge } from "tailwind-merge"

interface TaskCardProps {
    baseUrl: string
    provided: DraggableProvided
    snapshot: DraggableStateSnapshot
    task: Task
}

export default function TaskCard({ baseUrl, provided, snapshot, task }: Readonly<TaskCardProps>) {
    function getDraggableClasses(snapshot: DraggableStateSnapshot): string {
        const baseStyle = tw`grid !cursor-move gap-4 rounded-lg bg-white p-4 shadow-sm transition-transform hover:shadow-md dark:bg-gray-800 dark:hover:shadow-lg`
        const isDragging = snapshot.isDragging

        let animationStyle: string | undefined
        if (snapshot.dropAnimation) {
            const { moveTo, curve, duration } = snapshot.dropAnimation
            animationStyle = moveTo ? tw`transition-all duration-[${duration}ms] ease-[${curve}]` : undefined
        }

        const draggingStyle = isDragging ? "shadow-lg transform scale-105" : undefined

        return twMerge(baseStyle, animationStyle, draggingStyle)
    }

    const taskUrl = `${baseUrl}/tasks/${task.id}`
    const dragDescId = `drag-desc-${task.id}`

    return (
        <Fragment>
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={getDraggableClasses(snapshot)}
                tabIndex={0}
                role="button"
                aria-roledescription="Draggable item"
                aria-describedby={dragDescId}>
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href={taskUrl}
                        className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                    </Link>

                    <EditTaskModal task={task} />
                </div>

                <p className="prose text-sm text-gray-600 dark:text-gray-300">{task.description}</p>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex -space-x-2 self-end">
                        {task.assignees.map((assignee, i) => {
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
                        })}
                    </div>

                    <div className="grid justify-items-end gap-2">
                        <TaskPriorityBadge taskPriority={task.priority} />
                        <DueDateBadge date={task.dueDate} />
                    </div>
                </div>
            </div>

            <span id={dragDescId} className="sr-only">
                Press space bar to start a drag. When dragging you can use the arrow keys to move the item around and
                escape to cancel. Ensure your screen reader is in focus mode or forms mode.
            </span>
        </Fragment>
    )
}
