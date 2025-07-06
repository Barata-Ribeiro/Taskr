"use client"

import { ProblemDetails } from "@/@types/application"
import createNewProject from "@/actions/project/create-new-project"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import DefaultTextarea from "@/components/ui/DefaultTextarea"
import applicationInitialState from "@/helpers/application-initial-state"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

interface CreateProjectFormProps {
    username: string
}

export default function CreateProjectForm({ username }: Readonly<CreateProjectFormProps>) {
    const [formState, formAction, pending] = useActionState(createNewProject, applicationInitialState())
    const router = useRouter()

    useEffect(() => {
        const baseUrl = `/dashboard/${username}/projects`
        if (formState.ok && formState.response?.data?.id) router.push(`${baseUrl}/${formState.response.data.id}`)
    }, [formState.ok, formState.response?.data?.id, router, username])

    return (
        <form action={formAction} className="space-y-6 p-4 sm:p-6">
            <DefaultInput
                type="text"
                name="title"
                label="Project Title"
                placeholder="e.g. My Awesome Project"
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required
            />

            <DefaultTextarea
                label="Description"
                name="description"
                placeholder="Describe your project..."
                description="Provide a brief description of your project. This will help others understand its purpose and scope."
                rows={4}
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required
            />

            <DefaultInput
                type="datetime-local"
                name="dueDate"
                label="Due Date"
                description="Select the deadline for this project. It must be in the future."
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required
            />

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
