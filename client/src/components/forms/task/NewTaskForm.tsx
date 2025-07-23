"use client"

import { ProblemDetails } from "@/@types/application"
import { TaskPriority, TaskStatus } from "@/@types/task"
import createNewTask from "@/actions/task/create-new-task"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import DefaultOption from "@/components/ui/DefaultOption"
import DefaultSelect from "@/components/ui/DefaultSelect"
import DefaultTextarea from "@/components/ui/DefaultTextarea"
import applicationInitialState from "@/helpers/application-initial-state"
import normalizeBadgeString from "@/utils/badge-string-normalizer"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"

interface NewTaskFormProps {
    projectId: number
}

export default function NewTaskForm({ projectId }: Readonly<NewTaskFormProps>) {
    const [formState, formAction, pending] = useActionState(createNewTask, applicationInitialState())
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        const baseUrl = `/dashboard/${session?.user.username}/projects`

        if (formState.ok && formState?.response) {
            const message = formState.response.message
            toast.success(message, {
                onClose: () => router.push(`${baseUrl}/${projectId}/tasks/${formState?.response?.data?.id}`),
            })
        }
    }, [formState.ok, formState.response, projectId, router, session?.user.username])

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="projectId" value={projectId} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DefaultInput
                    type="text"
                    name="title"
                    label="Task Title"
                    description="Provide a concise title for the task. This will help in identifying the task quickly."
                    placeholder="e.g. Implement User Authentication"
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required
                />

                <DefaultInput
                    type="datetime-local"
                    name="dueDate"
                    label="Due Date"
                    description="Select the deadline for this task. It must be in the future."
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required
                />
            </div>

            <DefaultTextarea
                label="Description"
                name="description"
                placeholder="Describe the task in detail..."
                description="Provide a detailed description of the task. Include any specific requirements or steps needed to complete it."
                rows={4}
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DefaultSelect
                    label="Task Status"
                    description="Select the current status of the task. This helps in tracking progress."
                    name="status"
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required>
                    <DefaultOption defaultValue="" disabled>
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
                    description="Select the priority level for this task. This helps in prioritizing tasks effectively."
                    name="priority"
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required>
                    <DefaultOption defaultValue="" disabled>
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
                {pending ? <Loading /> : "Create"}
            </DefaultButton>
        </form>
    )
}
