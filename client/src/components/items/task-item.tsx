import { CompleteTask } from "@/interfaces/task"

interface TaskItemProps {
    task: CompleteTask
}

export default function TaskItem({ task }: TaskItemProps) {
    return (
        <div className="border-b border-gray-200 py-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-ebony-900">{task.task.title}</h3>
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                        task.task.priority === "LOW"
                            ? "bg-green-100 text-green-800"
                            : task.task.priority === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                    }`}>
                    {task.task.priority}
                </span>
            </div>
            <p className="mt-1 text-sm text-ebony-500">{task.task.description}</p>
            <div className="mt-2 flex items-center text-sm text-ebony-400">
                <span>Due: {new Date(task.task.dueDate).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>Assigned to: {task.userAssigned?.displayName ?? "N/A"}</span>
            </div>
        </div>
    )
}
