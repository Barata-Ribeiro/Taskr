"use client"

import authLogin from "@/actions/auth/auth-login"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultCheckbox from "@/components/ui/DefaultCheckbox"
import DefaultInput from "@/components/ui/DefaultInput"
import applicationInitialState from "@/helpers/application-initial-state"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

export default function LoginForm() {
    const { update } = useSession()
    const [formState, formAction, pending] = useActionState(authLogin, applicationInitialState())
    const router = useRouter()

    useEffect(() => {
        if (formState.ok) update().then(session => router.replace(`/dashboard/${session?.user.username}`))
    }, [formState.ok, router]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <form action={formAction} className="mt-10 space-y-6">
            <DefaultInput
                type="text"
                name="usernameOrEmail"
                label="Username or Email"
                description="Access your account using an username or email address."
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required="true"
            />

            <DefaultInput
                type="password"
                name="password"
                label="Password"
                autoComplete="current-password"
                aria-autocomplete="list"
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required="true"
            />

            <div className="flex items-center justify-between">
                <DefaultCheckbox label="Remember me?" name="rememberMe" disabled={pending} aria-disabled={pending} />

                <Link
                    href="/auth/forgot-password"
                    className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                    Forgot password?
                </Link>
            </div>

            {formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={JSON.parse((formState.error as string).split(". R")[0])} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <DefaultButton type="submit" disabled={pending} aria-disabled={pending}>
                Sign in
            </DefaultButton>
        </form>
    )
}
