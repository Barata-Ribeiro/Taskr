"use client"

import patchUserUpdateAccount from "@/actions/user/patch-user-update-account"
import ApiRequestFormProps from "@/components/feedback/api-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { ProblemDetails } from "@/interfaces/actions"
import { Button, Field, Input, Label } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ChangeAccountPassword() {
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
            <Field>
                <Label htmlFor="currentPassword" className="block text-sm font-medium leading-6 text-gray-900">
                    Current Password
                </Label>
                <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                />
            </Field>
            <Field>
                <Label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                    New Password
                </Label>
                <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                />
            </Field>
            <Field>
                <Label htmlFor="confirmNewPassword" className="block text-sm font-medium leading-6 text-gray-900">
                    Confirm New Password
                </Label>
                <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
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
                    "Update Password"
                )}
            </Button>
        </form>
    )
}
