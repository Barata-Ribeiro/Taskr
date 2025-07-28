"use client"

import type { Comment } from "@/@types/comment"
import SafeMarkdown from "@/components/shared/SafeMarkdown"
import Avatar from "@/components/user/Avatar"
import dateFormatter from "@/utils/date-formatter"
import dateToNowFormatter from "@/utils/date-to-now-formatter"
import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface CommentProps {
    comment: Comment
    depth?: number
}

const MAX_VISIBLE_DEPTH = 2

export default function Comment({ comment, depth = 0 }: Readonly<CommentProps>) {
    const [isExpanded, setIsExpanded] = useState(true)
    const hasChildren = comment.children?.length > 0
    const { data: session } = useSession()

    useEffect(() => setIsExpanded(depth < MAX_VISIBLE_DEPTH), [depth])

    const baseUrl = `/dashboard/${session?.user?.username}`
    const profileUrl = `${baseUrl}/profile/${comment.user.username}`
    const linkLabel = `View ${comment.user.username}'s profile`

    return (
        <div
            {...(depth > 0 && { "data-hasDepth": "" })}
            className="group data-hasDepth:ml-6 data-hasDepth:border-l-2 data-hasDepth:border-gray-200 data-hasDepth:pl-4 data-hasDepth:dark:border-gray-700">
            {/*Comments*/}
            <div className="rounded-md border border-gray-200 bg-white p-4 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                <Disclosure as="details" className="flex-1" open defaultOpen>
                    <DisclosureButton
                        as="summary"
                        className="group flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
                        <ChevronDownIcon
                            aria-label="Open/Colapse the comment"
                            className="w-5 cursor-pointer border-gray-200 text-gray-400 transition duration-200 ease-out group-data-[open]:rotate-180"
                        />

                        <div className="mb-2 flex w-full items-center justify-between gap-3 border-l border-gray-200 pl-2 dark:border-gray-700">
                            <Link
                                href={profileUrl}
                                className="inline-flex items-center gap-x-2 rounded-full py-1 pr-2 pl-1 select-none hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label={linkLabel}
                                title={linkLabel}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Avatar url={comment.user.avatarUrl} name={comment.user.username} size="small" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {comment.user.username}
                                </span>
                            </Link>

                            <div className="inline-flex gap-x-2 divide-x divide-gray-200 dark:divide-gray-700">
                                <time
                                    dateTime={comment.createdAt}
                                    className="block pr-2 text-xs text-gray-500 dark:text-gray-400">
                                    {dateFormatter(comment.createdAt)}
                                </time>

                                <p className="block text-xs text-gray-300 dark:text-gray-500">
                                    {dateToNowFormatter(comment.createdAt).text}
                                </p>
                            </div>
                        </div>
                    </DisclosureButton>

                    <DisclosurePanel
                        transition
                        className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0">
                        <div className="mt-2 max-h-52 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                            <SafeMarkdown markdown={comment.content} container={false} />
                        </div>
                    </DisclosurePanel>
                </Disclosure>

                {hasChildren && depth > 0 && (
                    <Button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-marigold-600 hover:text-marigold-800 rounded px-2 py-1 text-sm">
                        {isExpanded ? "Collapse" : `Expand (${comment.childrenCount})`}
                    </Button>
                )}
            </div>

            {/*Children*/}
            {isExpanded && hasChildren && (
                <div className="mt-2 space-y-4">
                    {comment.children.map(child => (
                        <Comment key={child.id} comment={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}
