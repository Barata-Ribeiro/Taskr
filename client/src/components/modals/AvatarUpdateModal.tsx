"use client"

import { ProblemDetails } from "@/@types/application"
import { UserProfile } from "@/@types/user"
import patchChangeAvatar from "@/actions/user/patch-change-avatar"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import applicationInitialState from "@/helpers/application-initial-state"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { Dispatch, Fragment, type SetStateAction, useActionState, useEffect, useState } from "react"
import { toast } from "react-toastify"

interface AvatarUpdateModalProps {
    initialAvatarUrl: string | null
    setInitialProfile: Dispatch<SetStateAction<UserProfile>>
}

export default function AvatarUpdateModal({ initialAvatarUrl, setInitialProfile }: Readonly<AvatarUpdateModalProps>) {
    const [open, setOpen] = useState(false)
    const { update } = useSession()
    const [formState, formAction, pending] = useActionState(patchChangeAvatar, applicationInitialState())

    useEffect(() => {
        if (formState.ok) {
            const updatedProfile = formState?.response?.data as UserProfile

            setInitialProfile(prevProfile => ({
                ...prevProfile,
                avatarUrl: updatedProfile.avatarUrl,
            }))

            toast
                .promise(update(), {
                    pending: "Updating session...",
                    success: "Avatar updated successfully!",
                    error: {
                        render() {
                            return "Session update failed!"
                        },
                        onClose: () => setOpen(false),
                    },
                })
                .then(() => setOpen(false))
        }
    }, [formState.ok, formState?.response?.data, setInitialProfile]) // eslint-disable-line
    // react-hooks/exhaustive-deps

    return (
        <Fragment>
            <DefaultButton type="button" width="fit" onClick={() => setOpen(true)}>
                Change avatar
            </DefaultButton>

            <Dialog open={open} onClose={setOpen} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed top-0 z-10 w-screen overflow-y-auto sm:inset-0">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            as="form"
                            action={formAction}
                            transition
                            className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 dark:bg-gray-800">
                            <div className="space-y-2 px-4 pt-5 pb-4 sm:p-6">
                                <header className="flex min-h-24 items-center justify-center rounded-md bg-gray-800 text-white dark:bg-gray-700">
                                    <DialogTitle as="h3" className="grid text-2xl text-balance max-sm:px-1">
                                        Update Avatar{" "}
                                        <small className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
                                            (JPG, JPEG or PNG only)
                                        </small>
                                    </DialogTitle>
                                </header>

                                <DefaultInput
                                    type="search"
                                    name="avatarUrl"
                                    label="Avatar URL"
                                    placeholder="https://example.com/avatar.jpg"
                                    defaultValue={initialAvatarUrl ?? undefined}
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
                            </div>

                            <div className="flex gap-2 gap-x-2 bg-gray-50 px-4 py-3 sm:flex-row-reverse sm:px-6 dark:bg-gray-950">
                                <DefaultButton type="submit" width="fit" disabled={pending} aria-disabled={pending}>
                                    {pending ? <Loading /> : "Update"}
                                </DefaultButton>

                                <DefaultButton
                                    buttonType="ghost"
                                    width="fit"
                                    onClick={() => setOpen(false)}
                                    disabled={pending}
                                    aria-disabled={pending}
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
