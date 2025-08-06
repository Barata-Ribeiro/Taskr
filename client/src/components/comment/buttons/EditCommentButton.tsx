"use client"

import { Comment } from "@/@types/comment"
import EditCommentForm from "@/components/forms/comment/EditCommentForm"
import DefaultButton from "@/components/ui/DefaultButton"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { SquarePenIcon } from "lucide-react"
import { Session } from "next-auth"
import { Fragment, useState } from "react"

interface EditCommentButtonProps {
    session: Session | null
    comment: Comment
}

export default function EditCommentButton({ session, comment }: Readonly<EditCommentButtonProps>) {
    const [open, setOpen] = useState(false)

    const buttonLabel = `Edit comment by ${comment.author.displayName}`

    const isDisabled = session?.user.id !== comment.author.id && session?.user.username !== comment.author.username

    return (
        <Fragment>
            <DefaultButton
                onClick={() => setOpen(true)}
                disabled={isDisabled}
                aria-label={buttonLabel}
                buttonType="ghost"
                width="fit"
                isIconOnly>
                <SquarePenIcon aria-hidden size={16} />
            </DefaultButton>

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed top-0 z-10 w-screen overflow-y-auto sm:inset-0">
                    <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative max-h-[90dvh] transform overflow-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-gray-800">
                            <header className="relative mb-4 flex h-24 items-center justify-center rounded-md bg-gray-800 text-white dark:bg-gray-700">
                                <DialogTitle as="h3" className="text-2xl text-balance max-sm:px-1">
                                    Editing your comment
                                </DialogTitle>
                            </header>

                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                You can edit your comment below. Please ensure that the content adheres to our community
                                guidelines.
                            </p>
                            <EditCommentForm comment={comment} setOpened={setOpen} />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}
