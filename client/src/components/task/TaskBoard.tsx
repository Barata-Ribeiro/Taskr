"use client"

import { Task, TasksByStatus, TaskStatus } from "@/@types/task"
import moveTask from "@/actions/task/move-task"
import reorderTask from "@/actions/task/reorder-task"
import TaskColumn from "@/components/task/TaskColumn"
import { DragDropContext, DragStart, DragUpdate, Droppable, DropResult, ResponderProvided } from "@hello-pangea/dnd"
import { useCallback, useState } from "react"
import { toast } from "react-toastify"

interface TaskBoardProps {
    baseUrl: string
    projectId: number
    initialTasks: TasksByStatus
}

export default function TaskBoard({ baseUrl, projectId, initialTasks }: Readonly<TaskBoardProps>) {
    const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>(initialTasks)

    // Accessibility: Announce drag start
    const onDragStart = useCallback(
        (start: DragStart, provided: ResponderProvided) => {
            const position = start.source.index + 1
            const listName = start.source.droppableId
            const listLength = tasksByStatus[listName as keyof TasksByStatus]?.length ?? 0
            provided.announce(
                `You have lifted an item in position ${position} of ${listLength} in the ${listName} column.`,
            )
        },
        [tasksByStatus],
    )

    // Accessibility: Announce drag update
    const onDragUpdate = useCallback(
        (update: DragUpdate, provided: ResponderProvided) => {
            const { source, destination } = update
            if (!source || !destination) return

            const startPosition = source.index + 1
            const endPosition = destination.index + 1
            const sourceName = source.droppableId
            const destName = destination.droppableId
            const sourceLength = tasksByStatus[sourceName as keyof TasksByStatus]?.length ?? 0
            const destLength = tasksByStatus[destName as keyof TasksByStatus]?.length ?? 0

            if (source.droppableId === destination.droppableId) {
                provided.announce(
                    `You have moved the item from position ${startPosition} to position ${endPosition} of ${sourceLength} in the ${sourceName} column.`,
                )
            } else {
                provided.announce(
                    `You have moved the item from position ${startPosition} of ${sourceLength} in the ${sourceName} column to position ${endPosition} of ${destLength} in the ${destName} column.`,
                )
            }
        },
        [tasksByStatus],
    )

    // Accessibility: Announce drag end
    const onDragEnd = useCallback(
        async (result: DropResult, provided?: ResponderProvided) => {
            const statusKeyToEnum = {
                toDo: TaskStatus.TO_DO,
                inProgress: TaskStatus.IN_PROGRESS,
                done: TaskStatus.DONE,
            }

            const { source, destination, reason } = result
            const startPosition = source?.index !== undefined ? source.index + 1 : null
            const sourceName = source?.droppableId
            const destName = destination?.droppableId
            const endPosition = destination?.index !== undefined ? destination.index + 1 : null
            const sourceLength = sourceName ? (tasksByStatus[sourceName as keyof TasksByStatus]?.length ?? 0) : 0

            // Announce cancel
            if (reason === "CANCEL" && provided) {
                provided.announce(
                    `Movement cancelled. The item has returned to its starting position ${startPosition} of ${sourceLength} in the ${sourceName} column.`,
                )
                return
            }

            // Announce drop with/without destination
            if (!destination && provided) {
                provided.announce(
                    `The item has been dropped while not over a droppable location. The item has returned to its starting position of ${startPosition} in the ${sourceName} column.`,
                )
                return
            }

            if (source && destination && provided) {
                if (source.droppableId === destination.droppableId) {
                    provided.announce(
                        `You have dropped the item. It has moved from position ${startPosition} to position ${endPosition} in the ${sourceName} column.`,
                    )
                } else {
                    provided.announce(
                        `You have dropped the item. It has moved from position ${startPosition} in the ${sourceName} column to position ${endPosition} in the ${destName} column.`,
                    )
                }
            }

            if (!source || !destination) return

            if (source.droppableId === destination.droppableId && source.index === destination.index) return

            const sourceKey = source.droppableId as keyof TasksByStatus
            const destKey = destination.droppableId as keyof TasksByStatus

            toast.dismiss()

            if (sourceKey === destKey) {
                // Reorder within the same status
                const tasks = Array.from(tasksByStatus[sourceKey])
                const [reorderedTask] = tasks.splice(source.index, 1)
                tasks.splice(destination.index, 0, reorderedTask)
                const previousState = { ...tasksByStatus }
                setTasksByStatus({ ...tasksByStatus, [sourceKey]: tasks })

                try {
                    const taskIds = tasks.map(task => task.id)
                    const state = await reorderTask(projectId, { status: statusKeyToEnum[sourceKey], taskIds })
                    if (!state.ok) setTasksByStatus(previousState)
                    toast.success(state.response?.message)
                } catch (error) {
                    setTasksByStatus(previousState)
                    toast.error("Something went wrong while reordering tasks.")
                    console.error("Something went wrong while reordering tasks.: ", error)
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
                    const state = await moveTask(movedTask.id, { projectId, newStatus, newPosition })
                    if (!state.ok) setTasksByStatus(previousState)
                    toast.success(state.response?.message)
                } catch (error) {
                    setTasksByStatus(previousState)
                    toast.error("Something went wrong while moving the task.")
                    console.error("Something went wrong while moving the task.: ", error)
                }
            }
        },
        [projectId, tasksByStatus],
    )

    return (
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
            <div role="list" aria-label="Task board columns" className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {Object.entries(tasksByStatus).map(([statusKey, tasks]: [string, Task[]]) => (
                    <Droppable key={statusKey} droppableId={statusKey}>
                        {(provided, snapshot) => (
                            <TaskColumn
                                baseUrl={baseUrl}
                                provided={provided}
                                snapshot={snapshot}
                                statusKey={statusKey as keyof TasksByStatus}
                                projectId={projectId}
                                tasks={tasks}
                            />
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}
