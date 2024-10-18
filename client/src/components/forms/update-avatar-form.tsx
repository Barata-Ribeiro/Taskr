"use client"

import patchUserRemoveAvatar from "@/actions/user/patch-user-remove-avatar"
import patchUserUpdateAvatar from "@/actions/user/patch-user-update-avatar"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { UserContext } from "@/interfaces/user"
import {
    Button,
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Field,
    Input,
    Label,
} from "@headlessui/react"
import { DialogContent, DialogHeader } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaCircleUser, FaRegImage } from "react-icons/fa6"

interface UpdateAvatarFormProps {
    data: UserContext
}

export default function UpdateAvatarForm({ data }: Readonly<UpdateAvatarFormProps>) {
    const [openEditAvatar, setOpenEditAvatar] = useState(false)
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(patchUserUpdateAvatar, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) {
            setOpenEditAvatar(false)
            router.refresh()
        }
    }, [formState.ok, router])

    async function handleRemoveAvatar() {
        if (confirm("Are you sure you want to remove your avatar?")) {
            const state = await patchUserRemoveAvatar()

            if (state.ok) router.refresh()
        }
    }

    return (
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <div className="flex-shrink-0">
                {data.context.avatarUrl ? (
                    <Image
                        src={data.context.avatarUrl}
                        alt="User current avatar"
                        title="User current avatar"
                        className="aspect-square h-28 w-28 rounded-full bg-gray-100 object-cover shadow"
                        width={500}
                        height={500}
                        quality={75}
                        priority
                    />
                ) : (
                    <FaCircleUser
                        aria-label="Default - No Avatar Setup"
                        title="Default - No Avatar Setup"
                        className="h-28 w-28 rounded-full text-gray-400 shadow"
                    />
                )}
            </div>

            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => setOpenEditAvatar(true)}
                        className="rounded-md bg-ebony-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ebony-700 active:bg-ebony-800">
                        Change avatar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={isPending || !data.context.avatarUrl}
                        className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                        Remove avatar
                    </Button>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-400">
                    For best results, use an image at least 128px by 128px.
                </p>
            </div>

            <Dialog open={openEditAvatar} onClose={setOpenEditAvatar} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <form action={formAction} onSubmit={onSubmit}>
                                <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                        <FaRegImage aria-hidden="true" className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <DialogHeader className="mt-3 text-center sm:mt-5">
                                        <DialogTitle
                                            as="h3"
                                            className="text-base font-semibold leading-6 text-gray-900">
                                            Change Your Avatar
                                        </DialogTitle>
                                        <Description className="mt-2 text-sm text-gray-500">
                                            For best results, use an image at least 128px by 128px.
                                        </Description>
                                    </DialogHeader>

                                    <DialogContent className="mt-5 space-y-6">
                                        <Field>
                                            <Label
                                                htmlFor="currentPasswordAvatar"
                                                className="block text-sm font-medium leading-6 text-gray-900">
                                                Current Password
                                            </Label>
                                            <Input
                                                id="currentPasswordAvatar"
                                                name="currentPassword"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                aria-required
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                                            />
                                        </Field>
                                        <Field>
                                            <Label
                                                htmlFor="avatarUrl"
                                                className="block text-sm font-medium leading-6 text-gray-900">
                                                Avatar URL
                                            </Label>
                                            <div className="mt-2 flex rounded-md shadow-sm">
                                                <span className="inline-flex select-none items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                                                    https://
                                                </span>
                                                <Input
                                                    id="avatarUrl"
                                                    name="avatarUrl"
                                                    type="url"
                                                    placeholder="https://example.com/johndoe.png"
                                                    required
                                                    aria-required
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </Field>
                                    </DialogContent>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="inline-flex w-full justify-center rounded-md bg-ebony-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ebony-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 disabled:opacity-50 sm:col-start-2">
                                        {isPending ? (
                                            <>
                                                <Spinner /> Loading...
                                            </>
                                        ) : (
                                            "Update Avatar"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        data-autofocus="true"
                                        onClick={() => setOpenEditAvatar(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
