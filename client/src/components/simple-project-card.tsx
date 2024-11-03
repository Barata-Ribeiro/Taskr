import { Task } from "@/interfaces/task"
import parseDate from "@/utils/parse-date"
import { twMerge } from "tailwind-merge"

interface SimpleProjectCardProps {
    name: string
    isManager: boolean
    totalTasks: number
    latestTasks: Task[]
}

export default function SimpleProjectCard({
    name,
    isManager,
    totalTasks,
    latestTasks,
}: Readonly<SimpleProjectCardProps>) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-derek">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{name}</h3>
                {isManager && <span className="text-sm text-indigo-500">Manager</span>}
            </div>

            <p className="mb-2 text-gray-600">Total Tasks: {totalTasks}</p>

            <div>
                <h4 className="text-md mb-2 font-heading">Latest Tasks</h4>
                <ul>
                    {latestTasks.map(task => {
                        const isTaskDone = task.status === "DONE"
                        const isTaskInProgress = task.status === "IN_PROGRESS"

                        const taskStatusStyleIfInProgress = isTaskInProgress
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"

                        return (
                            <li key={task.id} className="mb-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{task.title}</span>
                                    <span
                                        className={twMerge(
                                            "rounded px-2 py-1 text-xs capitalize",
                                            isTaskDone ? "bg-green-200 text-green-800" : taskStatusStyleIfInProgress,
                                        )}>
                                        {task.status.replace("_", " ")}
                                    </span>
                                </div>
                                <time dateTime={task.dueDate} className="text-sm text-gray-500">
                                    Due: {parseDate(task.dueDate)}
                                </time>
                            </li>
                        )
                    })}
                    {latestTasks.length === 0 && <p className="text-sm text-gray-500">No recent tasks.</p>}
                </ul>
            </div>
        </div>
    )
}
