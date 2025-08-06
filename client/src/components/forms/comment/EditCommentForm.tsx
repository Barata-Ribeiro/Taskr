"use client"

import { ProblemDetails } from "@/@types/application"
import { Comment } from "@/@types/comment"
import patchOwnComment from "@/actions/comment/patch-own-comment"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultMarkdownEditor from "@/components/ui/DefaultMarkdownEditor"
import applicationInitialState from "@/helpers/application-initial-state"
import { useParams } from "next/navigation"
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react"

interface EditCommentFormProps {
    comment: Comment
    setOpened?: Dispatch<SetStateAction<boolean>>
}

export default function EditCommentForm({ comment, setOpened }: Readonly<EditCommentFormProps>) {
    const [formState, formAction, pending] = useActionState(patchOwnComment, applicationInitialState())
    const [bodyContent, setBodyContent] = useState<string>(comment.content)
    const params = useParams<{ username: string; projectId: string; taskId: string }>()

    useEffect(() => {
        if (formState.ok) {
            setOpened?.(false)
            setBodyContent("")
        }
    }, [formState.ok, setOpened])

    return (
        <form action={formAction} className="w-full space-y-6">
            <input type="hidden" name="projectId" defaultValue={params.projectId} readOnly />
            <input type="hidden" name="commentId" defaultValue={comment.id} readOnly />
            <input type="hidden" name="taskId" defaultValue={comment.taskId} readOnly />

            <DefaultMarkdownEditor
                label="Content"
                name="body"
                value={bodyContent}
                setValue={setBodyContent}
                disabled={pending}
                aria-disabled={pending}
                required
                aria-required
            />

            {formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={formState.error as ProblemDetails} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <DefaultButton type="submit" disabled={pending} aria-disabled={pending}>
                {pending ? <Loading /> : "Save"}
            </DefaultButton>
        </form>
    )
}
