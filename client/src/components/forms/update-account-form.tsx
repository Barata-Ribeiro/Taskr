"use client"

import patchUserUpdateAccount from "@/actions/user/patch-user-update-account"
import ApiRequestFormProps from "@/components/feedback/api-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { ProblemDetails } from "@/interfaces/actions"
import { UserContext } from "@/interfaces/user"
import { Button, Field, Fieldset, Input, Label, Legend } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface UpdateAccountProps {
    data: UserContext
}

export default function UpdateAccount({ data }: Readonly<UpdateAccountProps>) {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(patchUserUpdateAccount, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            router.refresh()
        }
    }, [formState.ok, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="space-y-6">
            <Fieldset className="mt-6 space-y-4">
                <Legend as="h3" className="grid text-lg font-bold">
                    Full Name{" "}
                    {data.context.fullName && (
                        <span className="text-sm font-medium leading-none text-gray-300">{data.context.fullName}</span>
                    )}
                </Legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field>
                        <Label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="John/Jane"
                            autoComplete="given-name"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                            autoComplete="family-name"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        />
                    </Field>
                </div>
            </Fieldset>

            <Field>
                <Label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                </Label>
                <Input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    defaultValue={data.context.username}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                />
            </Field>
            <Field>
                <Label htmlFor="displayName" className="block text-sm font-medium leading-6 text-gray-900">
                    Display Name
                </Label>
                <Input
                    type="text"
                    id="displayName"
                    name="displayName"
                    defaultValue={data.context.displayName}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                />
            </Field>
            <Field>
                <Label htmlFor="currentPasswordAccount" className="block text-sm font-medium leading-6 text-gray-900">
                    Current Password
                </Label>
                <Input
                    id="currentPasswordAccount"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-required
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
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
                    "Update Account"
                )}
            </Button>
        </form>
    )
}
