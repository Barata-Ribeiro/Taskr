"use client"

import postNewProject from "@/actions/projects/post-new-project"
import ApiRequestFormProps from "@/components/feedback/api-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { ProblemDetails } from "@/interfaces/actions"
import { Project } from "@/interfaces/project"
import { Button, Description, Field, Input, Label, Textarea } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewProjectForm({ orgId }: Readonly<{ orgId: string }>) {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postNewProject, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            const formData = formState.response?.data as Project
            router.push("/dashboard/projects/" + formData.id)
        }
    }, [formState.ok, formState.response?.data, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="mx-auto mt-8 grid max-w-4xl gap-y-8">
            <Input type="hidden" name="organizationId" value={orgId} />
            <Field>
                <Label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Project Name
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter project name"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                    required
                    aria-required
                />
                <Description className="mt-2 text-sm text-gray-500">
                    Your project name will be displayed publicly.
                </Description>
            </Field>

            <Field>
                <Label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Project Description
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Enter project description"
                    aria-describedby="org-description"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                    required
                    aria-required
                />
                <Description id="org-description" className="mt-2 text-sm text-gray-500">
                    Describe your project in detail.
                </Description>
            </Field>

            <Field>
                <Label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                    Project Deadline
                </Label>
                <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                    required
                    aria-required
                />
            </Field>

            {formState.error && !Array.isArray(formState.error) && (
                <ApiRequestFormProps error={formState.error as ProblemDetails} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <Button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center rounded-md bg-ebony-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ebony-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 active:bg-ebony-800 disabled:opacity-50">
                {isPending ? (
                    <>
                        <Spinner /> Loading...
                    </>
                ) : (
                    "Start Project"
                )}
            </Button>
        </form>
    )
}
