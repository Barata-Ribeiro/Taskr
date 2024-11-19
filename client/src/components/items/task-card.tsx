import Avatar from "@/components/helpers/avatar"
import { CompleteTask } from "@/interfaces/task"
import { getTaskPriorityColor, getTaskStatusColor } from "@/utils/get-color-functions"
import parseDate from "@/utils/parse-date"

interface TaskCardProps {
    data: CompleteTask
}

export default function TaskCard({ data }: TaskCardProps) {
    const statusColor = getTaskStatusColor(data.task.status)
    const priorityColor = getTaskPriorityColor(data.task.priority)

    return (
        <div className="flex flex-col rounded-lg bg-white p-6 shadow-standard md:flex-row md:justify-between">
            <div>
                <h4 className="mb-2 font-heading text-xl text-ebony-800">{data.task.title}</h4>
                <p className="mb-4 font-body text-base text-ebony-500">{data.task.description}</p>
                <div className="flex flex-wrap items-center text-sm text-ebony-400">
                    <span className={`mr-6 flex items-center ${statusColor}`}>
                        <span className={`mr-2 inline-block h-2 w-2 rounded-full bg-current`}></span>
                        {data.task.status.replace("_", " ")}
                    </span>
                    <span className={`mr-6 ${priorityColor}`}>
                        <strong>Priority:</strong> {data.task.priority}
                    </span>
                    <span className="mr-6">
                        <strong>Start:</strong> {parseDate(data.task.startDate)}
                    </span>
                    <span>
                        <strong>Due:</strong> {parseDate(data.task.dueDate)}
                    </span>
                </div>
            </div>
            <div className="mt-4 flex items-center md:mt-0">
                {data.userAssigned && (
                    <div className="mr-4 flex items-center">
                        <Avatar
                            src={data.userAssigned.avatarUrl}
                            size={32}
                            name={data.userAssigned.fullName ?? data.userAssigned.displayName}
                        />
                        <span className="ml-2 text-sm text-ebony-600">
                            {data.userAssigned.fullName ?? data.userAssigned.displayName}
                        </span>
                    </div>
                )}
                {data.userCreator && (
                    <div className="flex items-center">
                        <span className="text-sm text-ebony-400">Created by:</span>
                        <Avatar
                            src={data.userCreator.avatarUrl}
                            size={32}
                            name={data.userCreator.fullName ?? data.userCreator.displayName}
                        />
                        <span className="ml-2 text-sm text-ebony-600">
                            {data.userCreator.fullName ?? data.userCreator.displayName}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
