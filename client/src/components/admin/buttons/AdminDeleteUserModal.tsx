"use client"

import { ProblemDetails } from "@/@types/application"
import adminDeleteUserByUsername from "@/actions/admin/admin-delete-user-by-username"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { Trash2Icon, TriangleAlertIcon } from "lucide-react"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { Fragment, useState, useTransition } from "react"
import { toast } from "react-toastify"

interface AdminDeleteUserModalProps {
    username: string
    session: Session | null
}

export default function AdminDeleteUserModal({ username, session }: Readonly<AdminDeleteUserModalProps>) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const url = `/dashboard/${session?.user.username}/admin/users`

    function handleDelete() {
        if (!username || !session) return

        startTransition(async () => {
            const deleteState = await adminDeleteUserByUsername(username)

            if (!deleteState.ok) {
                const error = deleteState.error as ProblemDetails
                setOpen(false)
                toast.error(error.detail ?? "An error occurred while deleting the user account.")
                return
            }

            setOpen(false)
            toast.success(`${username}'s account deleted successfully.`)
            router.replace(url)
        })
    }

    return (
        <Fragment>
            <div className="w-full md:col-span-2">
                <DefaultButton buttonType="danger" width="fit" onClick={() => setOpen(true)}>
                    <Trash2Icon aria-hidden size={16} />
                    Delete Account
                </DefaultButton>
            </div>

            <Dialog open={open} onClose={setOpen} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-900">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10 dark:bg-red-800">
                                        <TriangleAlertIcon
                                            aria-hidden
                                            size={24}
                                            className="text-red-400 dark:text-red-200"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-semibold">
                                            Delete account
                                        </DialogTitle>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Are you sure you want to delete <strong>{username}</strong>&apos;s account?
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="gap-2 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-800">
                                <DefaultButton
                                    buttonType="danger"
                                    width="fit"
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    aria-disabled={isPending}>
                                    {isPending ? <Loading /> : "Delete"}
                                </DefaultButton>

                                <DefaultButton
                                    buttonType="ghost"
                                    width="fit"
                                    onClick={() => setOpen(false)}
                                    disabled={isPending}
                                    aria-disabled={isPending}
                                    autoFocus>
                                    Cancel
                                </DefaultButton>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}
