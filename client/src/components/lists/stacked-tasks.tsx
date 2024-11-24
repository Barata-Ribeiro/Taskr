import TaskItem from "@/components/items/task-item"
import { CompleteTask, SortedTasks } from "@/interfaces/task"

interface StackedTasksProps {
    tasks: SortedTasks
}

export default function StackedTasks({ tasks }: StackedTasksProps) {
    const renderTaskGroup = (tasks: CompleteTask[], title: string) => {
        if (tasks.length === 0) return null
        return (
            <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-ebony-700">{title}</h3>
                {tasks.map(task => (
                    <TaskItem key={task.task.id} task={task} />
                ))}
            </div>
        )
    }

    return (
        <div>
            {renderTaskGroup(tasks.highPriority, "High Priority")}
            {renderTaskGroup(tasks.mediumPriority, "Medium Priority")}
            {renderTaskGroup(tasks.lowPriority, "Low Priority")}
        </div>
    )
}
