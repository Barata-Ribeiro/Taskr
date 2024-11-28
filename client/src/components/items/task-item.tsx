import BadgePriority from "@/components/badges/badge-priority"
import BadgeTaskStatus from "@/components/badges/badge-task-status"
import { CompleteTask } from "@/interfaces/task"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa6"

interface TaskItemProps {
    projectId: number
    data: CompleteTask
}

export default function TaskItem({ projectId, data }: TaskItemProps) {
    return (
        <li id={data.task.id + "_" + data.task.title}>
            <Link
                href={`/dashboard/projects/${projectId}/tasks/${data.task.id}`}
                aria-label={`View task: ${data.task.title}`}
                title={`View task: ${data.task.title}`}
                className="relative flex items-center gap-4 rounded-lg px-2 hover:bg-gray-50">
                <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-x-3">
                        <BadgeTaskStatus status={data.task.status} />
                        <div className="inline-flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900">
                            <h3 className="min-w-0 truncate">{data.task.title}</h3>
                            <span className="min-w-0 text-gray-400">/</span>
                            <p
                                className="min-w-0 truncate"
                                aria-label={data.task.description}
                                title={data.task.description}>
                                {data.task.description}
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                        <time dateTime={data.task.startDate} className="whitespace-nowrap">
                            {" "}
                            Start {parseDate(data.task.startDate)}
                        </time>
                        <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                            <circle r={1} cx={1} cy={1} />
                        </svg>
                        <time dateTime={data.task.dueDate} className="whitespace-nowrap">
                            {" "}
                            Due {parseDate(data.task.dueDate)}
                        </time>
                    </div>
                </div>

                <div className="mt-2 inline-flex items-center gap-x-2">
                    <BadgePriority priority={data.task.priority} />

                    <FaChevronRight aria-hidden="true" className="h-4 w-4 flex-none text-gray-400" />
                </div>
            </Link>
        </li>
    )
}
