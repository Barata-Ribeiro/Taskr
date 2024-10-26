"use client"

import postNewOrganization from "@/actions/organizations/post-new-organization"
import ApiRequestFormProps from "@/components/feedback/api-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { ProblemDetails } from "@/interfaces/actions"
import { Organization } from "@/interfaces/organization"
import { Button, Description, Field, Input, Label, Textarea } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewOrganizationForm() {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postNewOrganization, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            const formData = formState.response?.data as Organization
            router.push("/dashboard/organizations/" + formData.id)
        }
    }, [formState.ok, formState.response?.data, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="mx-auto mt-8 max-w-4xl">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Create Your Organization</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
                Fill out the form below to create your organization. Only the name and description are required. You can
                start managing your projects efficiently.
            </p>

            <div className="mt-10 grid gap-y-8">
                <Field className="max-w-md">
                    <Label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Organization Name
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Acme Inc."
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        required
                        aria-required
                    />
                    <Description className="mt-2 text-sm text-gray-500">
                        Your organization name will be displayed publicly.
                    </Description>
                </Field>

                <Field>
                    <Label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                        required
                        aria-required
                    />
                    <Description className="mt-2 text-sm text-gray-500">
                        Describe your organization and what it does. This will help others understand what your
                        organization is about.
                    </Description>
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
                        "Create Organization"
                    )}
                </Button>
            </div>
        </form>
    )
}
