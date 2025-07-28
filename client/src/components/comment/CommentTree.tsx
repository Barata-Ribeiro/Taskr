import { ProblemDetails } from "@/@types/application"
import getCommentsByTaskId from "@/actions/comment/get-comments-by-task-id"
import Comment from "@/components/comment/Comment"
import NewCommentForm from "@/components/forms/comment/NewCommentForm"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"

interface CommentTreeProps {
    taskId: string
}

export default async function CommentTree({ taskId }: Readonly<CommentTreeProps>) {
    const commentsResponse = await getCommentsByTaskId(parseInt(taskId))

    if (!commentsResponse.ok || !commentsResponse.response?.data) {
        const isProblemDetails = (commentsResponse.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (commentsResponse.error as ProblemDetails).detail
            : "An error occurred while fetching the comments."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const comments = commentsResponse.response.data

    return (
        <div className="block space-y-4">
            <header className="border-b border-gray-200 pb-5 dark:border-gray-700">
                <div className="-mt-2 -ml-2 flex flex-wrap items-baseline">
                    <h2 className="mt-2 ml-2 text-base font-semibold">Comments</h2>
                    <p className="mt-1 ml-2 truncate text-sm text-gray-500 dark:text-gray-400">
                        {comments.length} comment{comments.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </header>

            <NewCommentForm />

            {comments.map(comment => (
                <Comment comment={comment} key={comment.id} />
            ))}

            {comments.length <= 0 && (
                <span className="mx-auto text-sm text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to add a comment!
                </span>
            )}
        </div>
    )
}
