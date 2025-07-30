import { ProblemDetails } from "@/@types/application"
import { Task, TaskPriority, TaskStatus } from "@/@types/task"
import updateTaskById from "@/actions/task/update-task-by-id"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import DefaultMarkdownEditor from "@/components/ui/DefaultMarkdownEditor"
import DefaultOption from "@/components/ui/DefaultOption"
import DefaultSelect from "@/components/ui/DefaultSelect"
import DefaultTextarea from "@/components/ui/DefaultTextarea"
import applicationInitialState from "@/helpers/application-initial-state"
import normalizeBadgeString from "@/utils/badge-string-normalizer"
import { useParams } from "next/navigation"
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react"
import { toast } from "react-toastify"

interface EditTaskFormProps {
    task: Task
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function EditTaskForm({ task, setOpen }: Readonly<EditTaskFormProps>) {
    const [formState, formAction, pending] = useActionState(updateTaskById, applicationInitialState())
    const [bodyContent, setBodyContent] = useState<string>("")
    const params = useParams<{ username: string; projectId: string; taskId: string }>()

    useEffect(() => {
        if (task) setBodyContent(task.description)
        return () => setBodyContent("")
    }, [task])

    useEffect(() => {
        if (formState.ok && formState?.response) {
            const message = formState.response.message
            toast.success(message, { onClose: () => setOpen(false) })
        }
    }, [formState.ok, formState.response, setOpen])

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="taskId" defaultValue={task.id} readOnly />
            <input type="hidden" name="projectId" defaultValue={params.projectId} readOnly />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DefaultInput
                    type="text"
                    name="taskTitle"
                    label="Task Title"
                    placeholder="e.g. Implement User Authentication"
                    defaultValue={task.title}
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required
                />

                <DefaultInput
                    type="datetime-local"
                    name="dueDate"
                    label="Due Date"
                    defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""}
                    disabled={pending}
                    aria-disabled={pending}
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
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required
            />

            <DefaultMarkdownEditor
                label="Description"
                name="description"
                description="Provide a detailed description of the task. Include any specific requirements or steps needed to complete it."
                value={bodyContent}
                setValue={setBodyContent}
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DefaultSelect
                    label="Task Status"
                    name="status"
                    defaultValue={task.status}
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required>
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
                    disabled={pending}
                    aria-disabled={pending}
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

            {formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={formState.error as ProblemDetails} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <DefaultButton type="submit" disabled={pending} aria-disabled={pending}>
                {pending ? <Loading /> : "Update"}
            </DefaultButton>
        </form>
    )
}
