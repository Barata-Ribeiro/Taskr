"use client"

import { ProblemDetails } from "@/@types/application"
import adminToggleUserBan from "@/actions/admin/admin-toggle-user-ban"
import Spinner from "@/components/shared/Spinner"
import DefaultButton from "@/components/ui/DefaultButton"
import { BanIcon } from "lucide-react"
import { Session } from "next-auth"
import { type MouseEvent, useTransition } from "react"
import { toast } from "react-toastify"

interface AdminToggleBanButtonProps {
    username: string
    session: Session | null
}

export default function AdminToggleBanButton({ username, session }: Readonly<AdminToggleBanButtonProps>) {
    const [isPending, startTransition] = useTransition()

    const isAdmin = session?.user.role === "ADMIN"

    function toggleBan(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
        event.preventDefault()
        event.stopPropagation()
        if (!isAdmin) return

        startTransition(async () => {
            const banState = await adminToggleUserBan(username)

            if (!banState.ok) {
                const error = banState.error as ProblemDetails
                toast.error(error.detail ?? "An error occurred while processing the request.")
                return
            }

            const response = banState.response
            toast.success(response?.message ?? "Ban status updated successfully.")
        })
    }

    return (
        <DefaultButton
            buttonType="ghost"
            width="fit"
            onClick={toggleBan}
            aria-label="Toggle user ban"
            title="Toggle user ban"
            disabled={!isAdmin || isPending}
            isIconOnly>
            {isPending ? <Spinner /> : <BanIcon aria-hidden size={16} />}
        </DefaultButton>
    )
}
