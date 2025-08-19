"use client"

import { ProblemDetails } from "@/@types/application"
import adminToggleUserVerification from "@/actions/admin/admin-toggle-user-verification"
import Spinner from "@/components/shared/Spinner"
import DefaultButton from "@/components/ui/DefaultButton"
import { BadgeCheckIcon } from "lucide-react"
import { Session } from "next-auth"
import { type MouseEvent, useTransition } from "react"
import { toast } from "react-toastify"

interface AdminToggleVerificationProps {
    username: string
    session: Session | null
}

export default function AdminToggleVerification({ username, session }: Readonly<AdminToggleVerificationProps>) {
    const [isPending, startTransition] = useTransition()

    const isAdmin = session?.user.role === "ADMIN"

    function toggleVerification(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
        event.preventDefault()
        event.stopPropagation()
        if (!isAdmin) return

        startTransition(async () => {
            const verificationState = await adminToggleUserVerification(username)

            if (!verificationState.ok) {
                const error = verificationState.error as ProblemDetails
                toast.error(error.detail ?? "An error occurred while processing the request.")
                return
            }

            const response = verificationState.response
            toast.success(response?.message ?? "Verification status updated successfully.")
        })
    }

    return (
        <DefaultButton
            buttonType="ghost"
            width="fit"
            onClick={toggleVerification}
            aria-label="Toggle Verification"
            disabled={!isAdmin || isPending}
            isIconOnly>
            {isPending ? <Spinner /> : <BadgeCheckIcon aria-hidden size={16} />}
        </DefaultButton>
    )
}
