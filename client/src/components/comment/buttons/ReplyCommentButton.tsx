"use client"

import { Comment } from "@/@types/comment"
import NewCommentForm from "@/components/forms/comment/NewCommentForm"
import SafeMarkdown from "@/components/shared/SafeMarkdown"
import DefaultButton from "@/components/ui/DefaultButton"
import dateFormatter from "@/utils/date-formatter"
import dateToNowFormatter from "@/utils/date-to-now-formatter"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { ReplyIcon } from "lucide-react"
import { Session } from "next-auth"
import { Fragment, useState } from "react"

interface ReplyCommentButtonProps {
    session: Session | null
    comment: Comment
}

export default function ReplyCommentButton({ session, comment }: Readonly<ReplyCommentButtonProps>) {
    const [open, setOpen] = useState(false)

    const buttonLabel = `Reply to ${comment.user.displayName}`
    const date = dateFormatter(comment.createdAt)
    const dateToNow = dateToNowFormatter(comment.createdAt).text
    const dateLabel = `Commented on ${date}`

    const isDisabled = session?.user.id === comment.user.id && session?.user.username === comment.user.username

    return (
        <Fragment>
            <DefaultButton
                onClick={() => setOpen(true)}
                disabled={isDisabled}
                aria-label={buttonLabel}
                buttonType="ghost"
                width="fit"
                isIconOnly>
                <ReplyIcon aria-hidden size={16} />
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
                                    Reply to {comment.user.username}
                                </DialogTitle>
                            </header>

                            <div className="my-4 border-b border-gray-200 pb-2 dark:border-gray-700">
                                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                                    <p className="order-2 sm:order-1">
                                        <span className="font-semibold">{comment.user.username}</span> wrote
                                    </p>

                                    <div className="order-1 flex flex-col gap-2 divide-gray-200 max-sm:divide-y sm:order-2 sm:flex-row sm:divide-x dark:divide-gray-700">
                                        <time
                                            dateTime={comment.createdAt}
                                            aria-label={dateLabel}
                                            title={dateLabel}
                                            className="block pr-2 text-xs text-gray-500 dark:text-gray-400">
                                            {date}
                                        </time>

                                        <p className="block text-xs text-gray-300 dark:text-gray-500">{dateToNow}</p>
                                    </div>
                                </div>
                                <div className="mt-2 max-h-52 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                                    <SafeMarkdown markdown={comment.content} container={false} />
                                </div>
                            </div>

                            <NewCommentForm parentId={comment.id} displayAvatar={false} setOpened={setOpen} />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}
