"use client"

import { ProblemDetails } from "@/@types/application"
import { authRegister } from "@/actions/auth/auth-register"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import applicationInitialState from "@/helpers/application-initial-state"
import { useActionState } from "react"

export default function RegisterForm() {
    const [formState, formAction, pending] = useActionState(authRegister, applicationInitialState())

    return (
        <form action={formAction} className="mt-10 space-y-6">
            <DefaultInput
                type="text"
                label="Username"
                name="username"
                placeholder="e.g. john/janedoe"
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required="true"
            />

            <DefaultInput
                type="email"
                name="email"
                label="Email"
                placeholder="e.g. contact@example.com"
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required="true"
            />

            <DefaultInput
                type="text"
                name="displayName"
                label="Display Name"
                placeholder="e.g. John/Jane Doe"
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required="true"
            />

            <DefaultInput
                type="password"
                name="password"
                label="Password"
                description="Must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace."
                autoComplete="new-password"
                aria-autocomplete="list"
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required="true"
            />

            <DefaultInput
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                description="Re-enter your password to confirm."
                autoComplete="new-password"
                aria-autocomplete="list"
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required="true"
            />

            {formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={formState.error as ProblemDetails} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <DefaultButton type="submit" disabled={pending} aria-disabled={pending}>
                {pending ? <Loading /> : "Sign Up"}
            </DefaultButton>
        </form>
    )
}
