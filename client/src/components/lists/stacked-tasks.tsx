import TaskItem from "@/components/items/task-item"
import NoTaskAvailable from "@/components/skeletons/no-task-available"
import { Project } from "@/interfaces/project"
import { CompleteTask, SortedTasks } from "@/interfaces/task"
import { Fragment } from "react"

interface StackedTasksProps {
    project: Project
    tasks: SortedTasks
}

export default function StackedTasks({ project, tasks }: StackedTasksProps) {
    const renderTaskGroup = (tasks: CompleteTask[], title: string) => {
        if (tasks.length === 0) return <NoTaskAvailable title={title} />

        return (
            <Fragment>
                <h2 id={`task-group-${title}`} className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <ul className="divide-y divide-gray-200" aria-labelledby={`task-group-${title}`}>
                    {tasks.map((completeTask, idx) => (
                        <TaskItem key={completeTask.task.id + "_" + idx} projectId={+project.id} data={completeTask} />
                    ))}
                </ul>
            </Fragment>
        )
    }

    return (
        <div className="grid grid-cols-1 divide-gray-200 max-md:divide-y md:grid-cols-3 md:divide-x">
            <div className="h-full w-full p-2">{renderTaskGroup(tasks.lowPriority, "Low Priority")}</div>
            <div className="h-full w-full p-2">{renderTaskGroup(tasks.mediumPriority, "Medium Priority")}</div>
            <div className="h-full w-full p-2">{renderTaskGroup(tasks.highPriority, "High Priority")}</div>
        </div>
    )
}
