import { Task, TaskPriority, TaskStatus } from "@/@types/task"
import DefaultInput from "@/components/ui/DefaultInput"
import DefaultMarkdownEditor from "@/components/ui/DefaultMarkdownEditor"
import DefaultOption from "@/components/ui/DefaultOption"
import DefaultSelect from "@/components/ui/DefaultSelect"
import DefaultTextarea from "@/components/ui/DefaultTextarea"
import normalizeBadgeString from "@/utils/badge-string-normalizer"
import { useEffect, useState } from "react"

interface EditTaskFormProps {
    task: Task
}

export default function EditTaskForm({ task }: Readonly<EditTaskFormProps>) {
    const [bodyContent, setBodyContent] = useState<string>("")

    useEffect(() => {
        if (task) setBodyContent(task.description)
        return () => setBodyContent("")
    }, [task])

    return (
        <form className="space-y-6">
            <input type="hidden" name="taskId" value={task.id} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DefaultInput
                    type="text"
                    name="taskTitle"
                    label="Task Title"
                    placeholder="e.g. Implement User Authentication"
                    defaultValue={task.title}
                    required
                    aria-required
                />

                <DefaultInput
                    type="datetime-local"
                    name="dueDate"
                    label="Due Date"
                    defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""}
                    required
                    aria-required
                />
            </div>

            <DefaultTextarea
                label="Summary"
                name="summary"
                placeholder="Briefly summarize the task..."
                rows={4}
                defaultValue={task.summary}
                maxLength={255}
                required
                aria-required
            />

            <DefaultMarkdownEditor
                label="Description"
                name="description"
                description="Provide a detailed description of the task. Include any specific requirements or steps needed to complete it."
                value={bodyContent}
                setValue={setBodyContent}
                required
                aria-required
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DefaultSelect label="Task Status" name="status" defaultValue={task.status} required aria-required>
                    <DefaultOption value="" disabled>
                        Select Status
                    </DefaultOption>
                    {Object.entries(TaskStatus).map(([key, value]) => (
                        <DefaultOption key={value} value={value}>
                            {normalizeBadgeString(key)}
                        </DefaultOption>
                    ))}
                </DefaultSelect>

                <DefaultSelect
                    label="Task Priority"
                    name="priority"
                    defaultValue={task.priority}
                    required
                    aria-required>
                    <DefaultOption value="" disabled>
                        Select Priority
                    </DefaultOption>
                    {Object.entries(TaskPriority).map(([key, value]) => (
                        <DefaultOption key={value} value={value}>
                            {normalizeBadgeString(key)}
                        </DefaultOption>
                    ))}
                </DefaultSelect>
            </div>
        </form>
    )
}
