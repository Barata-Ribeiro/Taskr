"use client"

import { Task, TasksByStatus, TaskStatus } from "@/@types/task"
import moveTask from "@/actions/task/move-task"
import reorderTask from "@/actions/task/reorder-task"
import Tooltip from "@/components/shared/Tooltip"
import Avatar from "@/components/user/Avatar"
import statusStringNormalizer from "@/utils/status-string-normalizer"
import tw from "@/utils/tw"
import {
    DragDropContext,
    Draggable,
    DraggableStateSnapshot,
    Droppable,
    DroppableStateSnapshot,
    DropResult,
} from "@hello-pangea/dnd"
import Link from "next/link"
import { useCallback, useState } from "react"
import { twMerge } from "tailwind-merge"

interface TaskBoardProps {
    baseUrl: string
    projectId: number
    initialTasks: TasksByStatus
}

export default function TaskBoard({ baseUrl, projectId, initialTasks }: Readonly<TaskBoardProps>) {
    const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>(initialTasks)

    const onDragEnd = useCallback(
        async (result: DropResult) => {
            const statusKeyToEnum = {
                toDo: TaskStatus.TO_DO,
                inProgress: TaskStatus.IN_PROGRESS,
                done: TaskStatus.DONE,
            }

            const { source, destination } = result
            if (!source || !destination) return

            if (source.droppableId === destination.droppableId && source.index === destination.index) return

            const sourceKey = source.droppableId as keyof TasksByStatus
            const destKey = destination.droppableId as keyof TasksByStatus

            if (sourceKey === destKey) {
                // Reorder within the same status
                const tasks = Array.from(tasksByStatus[sourceKey])
                const [reorderedTask] = tasks.splice(source.index, 1)
                tasks.splice(destination.index, 0, reorderedTask)
                const previousState = { ...tasksByStatus }
                setTasksByStatus({ ...tasksByStatus, [sourceKey]: tasks })

                try {
                    const taskIds = tasks.map(task => task.id)
                    const response = await reorderTask(projectId, { status: statusKeyToEnum[sourceKey], taskIds })
                    if (!response.ok) setTasksByStatus(previousState)
                } catch (error) {
                    setTasksByStatus(previousState)
                    console.error("Erro ao reordenar tarefas:", error)
                }
            } else {
                // Move to a different status
                const sourceTasks = Array.from(tasksByStatus[sourceKey])
                const destTasks = Array.from(tasksByStatus[destKey])
                const [movedTask] = sourceTasks.splice(source.index, 1)
                const updatedTask = { ...movedTask, status: statusKeyToEnum[destKey] }
                destTasks.splice(destination.index, 0, updatedTask)
                const previousState = { ...tasksByStatus }
                setTasksByStatus({
                    ...tasksByStatus,
                    [sourceKey]: sourceTasks,
                    [destKey]: destTasks,
                })

                try {
                    const newStatus = statusKeyToEnum[destKey]
                    const newPosition = destination.index + 1
                    const response = await moveTask(movedTask.id, { projectId, newStatus, newPosition })
                    if (!response.ok) {
                        setTasksByStatus(previousState)
                    }
                } catch (error) {
                    setTasksByStatus(previousState)
                    console.error("Erro ao mover tarefa:", error)
                }
            }
        },
        [projectId, tasksByStatus],
    )

    function getStatusColor(status: keyof TasksByStatus): string {
        switch (status) {
            case "toDo":
                return "bg-gray-100 text-gray-800"
            case "inProgress":
                return "bg-blue-100 text-blue-800"
            case "done":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    function getDroppableClasses(snapshot: DroppableStateSnapshot): string {
        const baseStyle = tw`flex flex-col gap-4 rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700`
        const isDraggingOver = snapshot.isDraggingOver

        return twMerge(baseStyle, isDraggingOver ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900")
    }

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

    // TODO: Add error handling and loading states
    // TODO: Add accessibility features
    // TODO: Abstract task board and task card rendering into separate components

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {Object.entries(tasksByStatus).map(([statusKey, tasks]: [string, Task[]]) => (
                    <Droppable key={statusKey} droppableId={statusKey}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={getDroppableClasses(snapshot)}>
                                <header
                                    className="inline-flex items-center gap-x-2 font-medium"
                                    role="region"
                                    aria-label={`${statusStringNormalizer(statusKey as keyof TasksByStatus)} column`}>
                                    <h2
                                        className={twMerge(
                                            getStatusColor(statusKey as keyof TasksByStatus),
                                            "rounded-full px-3 py-1 text-2xl font-semibold select-none",
                                        )}
                                        id={`taskboard-header-${statusKey}`}
                                        title={statusStringNormalizer(statusKey as keyof TasksByStatus)}
                                        aria-label={statusStringNormalizer(statusKey as keyof TasksByStatus)}>
                                        {statusStringNormalizer(statusKey as keyof TasksByStatus)}
                                    </h2>
                                    <span className="text-sm" aria-label={`${tasks.length} tasks`}>
                                        ( {tasks.length} )
                                    </span>
                                </header>
                                {tasks.map((task: Task, index: number) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={getDraggableClasses(snapshot)}>
                                                <h3 className="text-lg font-medium">{task.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {task.description}
                                                </p>
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
                                                                        <Avatar
                                                                            url={assignee.avatarUrl}
                                                                            name={assignee.displayName}
                                                                            size="extra-small"
                                                                        />
                                                                        <Tooltip content={assignee.displayName} />
                                                                    </Link>
                                                                )
                                                            }),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}
