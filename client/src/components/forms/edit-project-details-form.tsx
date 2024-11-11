"use client"

import patchUpdateProject from "@/actions/projects/patch-update-project"
import ApiRequestFormProps from "@/components/feedback/api-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { ProblemDetails } from "@/interfaces/actions"
import { Project } from "@/interfaces/project"
import { Button, Description, Field, Input, Label, Textarea } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface EditProjectDetailsFormProps {
    orgId: number
    project: Project
}

export default function EditProjectDetailsForm({ orgId, project }: Readonly<EditProjectDetailsFormProps>) {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(patchUpdateProject, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) router.push(`/dashboard/organizations/${orgId}/projects/${project.id}`)
    }, [formState.ok, orgId, project.id, router])

    return (
        <form
            action={formAction}
            onSubmit={onSubmit}
            className="rounded-lg bg-white shadow-derek ring-1 ring-gray-900/5 md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <Input type="hidden" name="organizationId" value={orgId} />
                    <Input type="hidden" name="projectId" value={project.id} />

                    <Field className="sm:col-span-4">
                        <Label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Name
                        </Label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={project.name}
                            placeholder="Project name"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        />
                    </Field>

                    <Field className="col-span-full">
                        <Label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={3}
                            maxLength={500}
                            placeholder="Write a description..."
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                            defaultValue={project.description}
                        />
                        <Description className="mt-3 text-sm leading-6 text-gray-600">
                            Briefly describe the project and its goals.
                        </Description>
                    </Field>

                    <Field className="sm:col-span-4">
                        <Label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                            Project Deadline
                        </Label>
                        <Input
                            id="deadline"
                            name="deadline"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        />
                    </Field>
                </div>
            </div>

            {formState.error && (
                <div className="border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    {formState.error && !Array.isArray(formState.error) && (
                        <ApiRequestFormProps error={formState.error as ProblemDetails} />
                    )}

                    {formState.error && Array.isArray(formState.error) && (
                        <InputValidationError errors={formState.error} />
                    )}
                </div>
            )}

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-800 active:text-gray-700">
                    Go Back
                </button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-md bg-ebony-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ebony-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 active:bg-ebony-800 disabled:opacity-50">
                    {isPending ? (
                        <>
                            <Spinner /> Loading...
                        </>
                    ) : (
                        "Update Project"
                    )}
                </Button>
            </div>
        </form>
    )
}
