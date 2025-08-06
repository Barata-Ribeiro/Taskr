"use client"

import { ProblemDetails }                                                          from "@/@types/application"
import createNewComment
                                                                                   from "@/actions/comment/create-new-comment"
import UnauthenticatedState
                                                                                   from "@/components/comment/UnauthenticatedState"
import OptimisticNewComment
                                                                                   from "@/components/forms/comment/OptimisticComment"
import ApplicationRequestFormError
                                                                                   from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError
                                                                                   from "@/components/shared/feedback/InputValidationError"
import Loading
                                                                                   from "@/components/shared/feedback/Loading"
import DefaultButton                                                               from "@/components/ui/DefaultButton"
import DefaultMarkdownEditor
                                                                                   from "@/components/ui/DefaultMarkdownEditor"
import Avatar                                                                      from "@/components/user/Avatar"
import applicationInitialState
                                                                                   from "@/helpers/application-initial-state"
import tw                                                                          from "@/utils/tw"
import { useSession }                                                              from "next-auth/react"
import { useParams }                                                               from "next/navigation"
import { type Dispatch, type SetStateAction, useActionState, useEffect, useState } from "react"

interface NewCommentFormProps {
    parentId?: number
    displayAvatar?: boolean
    setOpened?: Dispatch<SetStateAction<boolean>>
}

export default function NewCommentForm({ parentId, displayAvatar = true, setOpened }: Readonly<NewCommentFormProps>) {
    const [formState, formAction, pending] = useActionState(createNewComment, applicationInitialState())
    const [bodyContent, setBodyContent] = useState<string>("")
    const params = useParams<{ username: string; projectId: string; taskId: string }>()
    const { data: session } = useSession()

    useEffect(() => {
        if (formState.ok) {
            setOpened?.(false)
            setBodyContent("")
        }
    }, [formState.ok, setOpened])

    if (!session) return <UnauthenticatedState />

    const containerClasses = {
        default: tw`mb-4 grid w-full grid-cols-1 items-start gap-x-4 border-b border-gray-200 pb-4 md:grid-cols-[auto_1fr] dark:border-gray-700`,
        reply: tw`grid w-full items-start gap-x-4`,
    }

    const isReply = Boolean(parentId)
    const label = isReply ? "Reply" : "Post"

    return (
        <div className={!isReply ? containerClasses.default : containerClasses.reply}>
            {displayAvatar && !isReply && (
                <div className="mb-2 inline-flex items-center gap-x-2 md:mb-0">
                    <Avatar url={session.user.avatarUrl} name={session.user.username} size="small" />
                    <small className="block text-sm md:hidden">{session.user.username}</small>
                </div>
            )}

            {pending && bodyContent ? (
                <OptimisticNewComment content={bodyContent} />
            ) : (
                <form action={formAction} className="w-full space-y-6">
                    <input type="hidden" name="projectId" defaultValue={params.projectId} readOnly />
                    <input type="hidden" name="taskId" defaultValue={params.taskId} readOnly />
                    <input type="hidden" name="parentId" defaultValue={parentId} readOnly />

                    <DefaultMarkdownEditor
                        label="Content"
                        name="body"
                        height={200}
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

                    {formState.error && Array.isArray(formState.error) && (
                        <InputValidationError errors={formState.error} />
                    )}

                    <DefaultButton type="submit" disabled={pending} aria-disabled={pending}>
                        {pending ? <Loading /> : label}
                    </DefaultButton>
                </form>
            )}
        </div>
    )
}
