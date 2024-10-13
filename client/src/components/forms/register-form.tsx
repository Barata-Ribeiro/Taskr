"use client"

import postAuthRegister from "@/actions/auth/post-auth-register"
import ApiRequestError from "@/components/feedback/api-request-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { ProblemDetails } from "@/interfaces/actions"
import { User } from "@/interfaces/user"
import { Button, Field, Input, Label } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RegisterForm() {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthRegister, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            const response = formState.response
            router.replace(
                `/auth/login?success=${response?.code === 201}&message=${response?.message}&username=${(response?.data as User).username}`,
            )
        }
    }, [formState, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="space-y-6 overflow-y-auto">
            <Field>
                <Label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                </Label>
                <Input
                    type="text"
                    id="username"
                    name="username"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                    required
                    aria-required
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
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                    required
                    aria-required
                />
            </Field>
            <Field>
                <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                </Label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                    required
                    aria-required
                />
            </Field>
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <Field className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-ebony-600">
                    <Label htmlFor="password" className="block text-xs font-medium text-gray-900">
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        className="block w-full rounded border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        autoComplete="new-password"
                        required
                        aria-required
                    />
                </Field>
                <Field className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-ebony-600">
                    <Label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-900">
                        Confirm Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="block w-full rounded border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        required
                        aria-required
                    />
                </Field>
            </div>

            {formState.error && !Array.isArray(formState.error) && (
                <ApiRequestError error={formState.error as ProblemDetails} />
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
                    "Sign Up"
                )}
            </Button>
        </form>
    )
}
