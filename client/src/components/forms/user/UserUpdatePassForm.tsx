"use client"

import { ProblemDetails } from "@/@types/application"
import authLogout from "@/actions/auth/auth-logout"
import pathChangePassword from "@/actions/user/path-change-password"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import applicationInitialState from "@/helpers/application-initial-state"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"

export default function UserUpdatePassForm() {
    const [formState, formAction, pending] = useActionState(pathChangePassword, applicationInitialState())
    const router = useRouter()

    useEffect(() => {
        if (formState.ok) {
            toast
                .promise(authLogout(), {
                    pending: "Logging out...",
                    success: "Password changed successfully! You will be logged out.",
                    error: {
                        render() {
                            return "Failed to logout. Please try again."
                        },
                        onClose: () => router.refresh(),
                    },
                })
                .then(() => router.replace("/auth/login"))
        }
    }, [formState.ok, router])

    return (
        <form action={formAction} className="space-y-6 md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <DefaultInput
                    type="password"
                    name="currentPassword"
                    label="Current Password"
                    autoComplete="current-password"
                    aria-autocomplete="list"
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required="true"
                />

                <DefaultInput
                    type="password"
                    name="newPassword"
                    label="New Password"
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
                    disabled={pending}
                    aria-disabled={pending}
                    required
                    aria-required="true"
                />
            </div>

            {formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={formState.error as ProblemDetails} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <DefaultButton type="submit" disabled={pending} aria-disabled={pending} width="fit">
                {pending ? <Loading /> : "Change Password"}
            </DefaultButton>
        </form>
    )
}
