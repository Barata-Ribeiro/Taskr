import TaskCard from "@/components/items/task-card"
import { CompleteTask } from "@/interfaces/task"

interface TaskCategoryProps {
    title: string
    tasks: CompleteTask[]
    priorityColor: string
}

export default function TaskCategory({ title, tasks, priorityColor }: TaskCategoryProps) {
    if (tasks.length === 0) return null
    return (
        <div className="mb-8">
            <h3 className={`mb-4 font-heading text-2xl ${priorityColor}`}>{title}</h3>
            <div className="space-y-4">
                {tasks.map(completeTask => (
                    <TaskCard key={completeTask.task.id} data={completeTask} />
                ))}
            </div>
        </div>
    )
}
