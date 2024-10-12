"use client"

import postAuthLogin from "@/actions/auth/post-auth-login"
import ApiRequestError from "@/components/feedback/api-request-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { Button, Field, Input, Label } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginForm() {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postAuthLogin, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) router.push("/")
    }, [formState, router])

    return (
        <form action={formAction} onSubmit={onSubmit} className="space-y-6">
            <Field>
                <Label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                </Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                />
            </Field>

            <Field>
                <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                />
            </Field>

            <div className="flex items-center justify-between">
                <Field className="flex items-center">
                    <Input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-english-holly-600 focus:ring-english-holly-600"
                    />
                    <Label htmlFor="rememberMe" className="ml-3 block text-sm leading-6 text-gray-900">
                        Remember me
                    </Label>
                </Field>

                <div className="text-sm leading-6">
                    <Link
                        href="/auth/forgot-password"
                        className="font-semibold text-ebony-600 decoration-2 underline-offset-4 hover:text-ebony-700 hover:underline active:text-ebony-800">
                        Forgot password?
                    </Link>
                </div>
            </div>

            {formState.error && !Array.isArray(formState.error) && (
                <ApiRequestError error={JSON.parse(formState.error.split(". R")[0])} />
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
                    "Sign In"
                )}
            </Button>
        </form>
    )
}
