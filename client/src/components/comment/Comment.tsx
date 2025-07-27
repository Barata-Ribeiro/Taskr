"use client"

import type { Comment } from "@/@types/comment"
import { useSession } from "next-auth/react"
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

    return (
        <div
            {...(depth > 0 && { "data-hasDepth": "" })}
            className="group data-hasDepth:ml-6 data-hasDepth:border-l-2 data-hasDepth:border-gray-200 data-hasDepth:pl-4 data-hasDepth:dark:border-gray-700">
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
