import { Comment } from "@/@types/comment"
import DeleteCommentButton from "@/components/comment/buttons/DeleteCommentButton"
import ViewContentButton from "@/components/comment/buttons/ViewContentButton"
import DefaultButton from "@/components/ui/DefaultButton"
import { Button } from "@headlessui/react"
import { ReplyIcon, SquarePenIcon } from "lucide-react"
import { Session } from "next-auth"
import { Dispatch, SetStateAction } from "react"

interface SoftDeletedCommentProps {
    comment: Comment
    hasChildren: boolean
    isExpanded: boolean
    setIsExpanded: Dispatch<SetStateAction<boolean>>
    depth: number
    session: Session | null
}
export default function SoftDeletedComment({
    comment,
    hasChildren,
    isExpanded,
    setIsExpanded,
    depth,
    session,
}: Readonly<SoftDeletedCommentProps>) {
    const isAdmin = session?.user.role === "ADMIN"
    const isBanned = session?.user.role === "BANNED"
    const buttonsDisabled = !isAdmin || isBanned || !session

    return (
        <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-gray-50 p-4 text-gray-500 italic dark:border-gray-700 dark:bg-gray-800">
            <p className="py-4">
                This comment has been deleted by an administrator for violation of our community guidelines.
            </p>
            <div className="inline-flex items-center gap-x-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                <ViewContentButton content={comment.content} isAdmin={isAdmin} isSoftDeleted={comment.isSoftDeleted} />

                <DefaultButton
                    aria-label="Reply to this comment"
                    title="Reply to this comment"
                    disabled
                    aria-disabled
                    buttonType="ghost"
                    width="fit"
                    isIconOnly>
                    <ReplyIcon aria-hidden size={16} />
                </DefaultButton>

                <DefaultButton
                    aria-label="Edit this comment"
                    title="Edit this comment"
                    disabled
                    aria-disabled
                    buttonType="ghost"
                    width="fit"
                    isIconOnly>
                    <SquarePenIcon aria-hidden size={16} />
                </DefaultButton>

                <DeleteCommentButton
                    projectId={0}
                    taskId={comment.taskId}
                    commentId={comment.id}
                    session={session}
                    author={comment.author}
                    disabled={buttonsDisabled}
                />
            </div>

            {hasChildren && depth > 0 && (
                <Button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-marigold-600 hover:text-marigold-800 rounded px-2 py-1 text-sm">
                    {isExpanded ? "Collapse" : `Expand (${comment.childrenCount})`}
                </Button>
            )}
        </div>
    )
}
