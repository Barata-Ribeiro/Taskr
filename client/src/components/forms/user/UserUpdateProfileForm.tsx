"use client"

import { ProblemDetails } from "@/@types/application"
import { UserProfile } from "@/@types/user"
import getPublicProfile from "@/actions/user/get-public-profile"
import AvatarUpdateModal from "@/components/modals/AvatarUpdateModal"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import { Field } from "@headlessui/react"
import Image from "next/image"
import { use, useState } from "react"
import blankAvatar from "../../../../public/images/blank-avatar.svg"

interface UserUpdateProfileFormProps {
    profilePromise: ReturnType<typeof getPublicProfile>
}

export default function UserUpdateProfileForm({ profilePromise }: Readonly<UserUpdateProfileFormProps>) {
    const profileState = use(profilePromise)
    const [initialProfile, setInitialProfile] = useState<UserProfile>(profileState?.response?.data as UserProfile)
    // const [formState, formAction, pending] = useActionState(patchChangePassword, applicationInitialState())

    if (!profileState?.response?.data) {
        const isProblemDetails = (profileState.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (profileState.error as ProblemDetails).detail
            : "An error occurred while loading your profile information."
        return <DashboardErrorMessage message={errorMessage} />
    }

    return (
        <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <Field className="col-span-full flex items-center gap-x-8">
                    <Image
                        src={initialProfile.avatarUrl ?? blankAvatar}
                        alt="Your avatar"
                        width={96}
                        height={96}
                        className="aspect-square size-24 rounded-lg object-cover object-center"
                        quality={100}
                        priority
                    />

                    <div className="grid gap-y-2">
                        <AvatarUpdateModal
                            initialAvatarUrl={initialProfile.avatarUrl}
                            setInitialProfile={setInitialProfile}
                        />
                        <p className="text-xs/5 text-gray-500 dark:text-gray-400">JPG, JPEG or PNG only.</p>
                    </div>
                </Field>
            </div>
        </form>
    )
}
