"use client"

import signIn from "@/actions/auth/sign-in"
import ErrorMessage from "@/components/general/error-message"
import LinkButton from "@/components/general/link-button"
import { LoginResponse } from "@/interfaces/auth"
import { Button, Checkbox, Field, Input, Label } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { FaLock } from "react-icons/fa6"

export default function SignInForm() {
    const router = useRouter()

    const [enabled, setEnabled] = useState(false)

    const { pending } = useFormStatus()
    const [state, action] = useFormState(signIn, {
        ok: false,
        clientError: null,
        response: null,
    })

    useEffect(() => {
        if (state.ok) {
            const response = state.response?.data as LoginResponse
            router.push("/dashboard/" + response.user.username)
        }
    }, [state, router])

    return (
        <form className="space-y-6" action={action}>
            <div className="-space-y-px rounded-lg shadow-standard">
                <Field>
                    <Label htmlFor="username" className="sr-only">
                        username
                    </Label>
                    <Input
                        type="username"
                        id="username"
                        name="username"
                        autoComplete="username"
                        className="form-input relative block w-full appearance-none rounded-none rounded-t-lg border border-background-200 px-3 py-2 text-body-950 placeholder-body-200 focus:z-10 focus:border-background-600 focus:outline-none focus:ring-background-600 sm:text-sm"
                        placeholder="Username"
                        required
                    />
                </Field>
                <Field>
                    <Label htmlFor="password" className="sr-only">
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="form-input relative block w-full appearance-none rounded-none rounded-b-lg border border-background-200 px-3 py-2 text-body-950 placeholder-body-200 focus:z-10 focus:border-background-600 focus:outline-none focus:ring-background-600 sm:text-sm"
                        placeholder="Password"
                        required
                    />
                </Field>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
                <Field className="flex items-center gap-2">
                    <Checkbox
                        name="rememberMe"
                        checked={enabled}
                        onChange={setEnabled}
                        className="group form-checkbox block size-4 rounded border bg-background-50 transition focus:ring-background-600 data-[checked]:bg-background-600">
                        <svg
                            className="stroke-white opacity-0 transition group-data-[checked]:opacity-100"
                            viewBox="0 0 14 14"
                            fill="none">
                            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Checkbox>
                    <Label className="select-none text-body-950">Remember Me?</Label>
                </Field>

                <LinkButton
                    href="/sign/forgot-password"
                    className="font-semibold text-body-400 hover:text-body-500 active:text-body-400">
                    Forgot your password?
                </LinkButton>
            </div>

            {state.clientError && <ErrorMessage error={state.clientError} />}

            <Button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-background-600 px-4 py-2 text-sm font-medium text-body-50 hover:bg-background-700 focus:outline-none active:bg-background-800">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-body-500 group-hover:text-body-400" aria-hidden="true" />
                </span>
                {pending ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    )
}
