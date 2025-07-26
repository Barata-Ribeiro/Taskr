import { Task, TasksByStatus } from "@/@types/task"
import TaskCard from "@/components/task/TaskCard"
import statusStringNormalizer from "@/utils/status-string-normalizer"
import tw from "@/utils/tw"
import { Draggable, DroppableProvided, DroppableStateSnapshot } from "@hello-pangea/dnd"
import { twMerge } from "tailwind-merge"

interface TaskColumnProps {
    baseUrl: string
    provided: DroppableProvided
    snapshot: DroppableStateSnapshot
    statusKey: string
    projectId: number
    tasks: Task[]
}

export default function TaskColumn({
    baseUrl,
    provided,
    snapshot,
    statusKey,
    projectId,
    tasks,
}: Readonly<TaskColumnProps>) {
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
        const baseStyle = tw`flex max-h-[calc(100dvh-220px)] flex-col gap-4 overflow-y-auto rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-700`
        const isDraggingOver = snapshot.isDraggingOver

        return twMerge(baseStyle, isDraggingOver ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900")
    }

    const status = statusKey as keyof TasksByStatus

    const titleDefaultStyles = tw`rounded-md border-l-4 px-3 py-1 font-semibold select-none`

    return (
        <div ref={provided.innerRef} {...provided.droppableProps} className={getDroppableClasses(snapshot)}>
            <header
                className="inline-flex items-center gap-x-2 border-b border-gray-200 pb-2 font-medium dark:border-gray-700"
                role="region"
                aria-label={`${statusStringNormalizer(status)} column`}>
                <h2
                    className={twMerge(getStatusColor(status), titleDefaultStyles)}
                    id={`taskboard-header-${statusKey}`}
                    title={statusStringNormalizer(status)}
                    aria-label={statusStringNormalizer(status)}>
                    {statusStringNormalizer(status)}
                </h2>
                <span className="text-sm" aria-label={`${tasks.length} tasks`}>
                    ( {tasks.length} )
                </span>
            </header>
            {tasks.map((task: Task, index: number) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided, snapshot) => (
                        <TaskCard
                            baseUrl={baseUrl}
                            provided={provided}
                            snapshot={snapshot}
                            projectId={projectId}
                            task={task}
                        />
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </div>
    )
}
