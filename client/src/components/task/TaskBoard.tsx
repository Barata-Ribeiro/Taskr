"use client"

import { Task, TasksByStatus, TaskStatus } from "@/@types/task"
import moveTask from "@/actions/task/move-task"
import reorderTask from "@/actions/task/reorder-task"
import TaskColumn from "@/components/task/TaskColumn"
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd"
import { useCallback, useState } from "react"

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

    // TODO: Add error handling and loading states

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div role="list" aria-label="Task board columns" className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {Object.entries(tasksByStatus).map(([statusKey, tasks]: [string, Task[]]) => (
                    <Droppable key={statusKey} droppableId={statusKey}>
                        {(provided, snapshot) => (
                            <TaskColumn
                                baseUrl={baseUrl}
                                provided={provided}
                                snapshot={snapshot}
                                statusKey={statusKey as keyof TasksByStatus}
                                tasks={tasks}
                            />
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}
