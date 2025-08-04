"use client"

import { ProblemDetails } from "@/@types/application"
import { UserProfile } from "@/@types/user"
import authLogout from "@/actions/auth/auth-logout"
import getPublicProfile from "@/actions/user/get-public-profile"
import patchProfileUpdate from "@/actions/user/patch-profile-update"
import AvatarUpdateModal from "@/components/modals/AvatarUpdateModal"
import ApplicationRequestFormError from "@/components/shared/feedback/ApplicationRequestFormError"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import InputValidationError from "@/components/shared/feedback/InputValidationError"
import Loading from "@/components/shared/feedback/Loading"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import DefaultMarkdownEditor from "@/components/ui/DefaultMarkdownEditor"
import applicationInitialState from "@/helpers/application-initial-state"
import { Field } from "@headlessui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { use, useActionState, useEffect, useState } from "react"
import { toast } from "react-toastify"
import blankAvatar from "../../../../public/images/blank-avatar.svg"

interface UserUpdateProfileFormProps {
    profilePromise: ReturnType<typeof getPublicProfile>
}

export default function UserUpdateProfileForm({ profilePromise }: Readonly<UserUpdateProfileFormProps>) {
    const profileState = use(profilePromise)
    const profile = profileState?.response?.data as UserProfile

    const [initialProfile, setInitialProfile] = useState<UserProfile>(profile)
    const [bodyContent, setBodyContent] = useState<string>(profile.bio ?? "")
    const [formState, formAction, pending] = useActionState(patchProfileUpdate, applicationInitialState())
    const router = useRouter()

    useEffect(() => {
        if (formState.ok) {
            const updatedProfile = formState.response?.data as UserProfile

            if (initialProfile.email !== updatedProfile.email || initialProfile.username !== updatedProfile.username) {
                toast
                    .promise(authLogout(), {
                        pending: "Logging out...",
                        success: "Profile updated successfully! You will be logged out.",
                        error: {
                            render() {
                                return "Failed to logout. Please try again."
                            },
                            onClose: () => router.refresh(),
                        },
                    })
                    .then(() => router.replace("/auth/login"))

                return
            }

            setInitialProfile({ ...initialProfile, ...updatedProfile })
            setBodyContent(updatedProfile.bio ?? "")
            toast.success("Profile updated successfully!")
        }
    }, [formState.ok, formState.response?.data, initialProfile, router])

    if (!profileState?.response?.data) {
        const isProblemDetails = (profileState.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (profileState.error as ProblemDetails).detail
            : "An error occurred while loading your profile information."
        return <DashboardErrorMessage message={errorMessage} />
    }

    return (
        <form action={formAction} className="md:col-span-2">
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

                <div className="sm:col-span-3">
                    <DefaultInput
                        type="text"
                        name="firstName"
                        label="First Name"
                        disabled={pending}
                        aria-disabled={pending}
                    />
                </div>

                <div className="sm:col-span-3">
                    <DefaultInput
                        type="text"
                        name="lastName"
                        label="Last Name"
                        disabled={pending}
                        aria-disabled={pending}
                    />
                </div>

                <DefaultInput
                    type="text"
                    name="username"
                    label="Username"
                    placeholder={initialProfile.username ?? "e.g. johndoe"}
                    disabled={pending}
                    aria-disabled={pending}
                />

                <DefaultInput
                    type="text"
                    name="displayName"
                    label="Display Name"
                    placeholder={initialProfile.displayName ?? "e.g. John Doe"}
                    disabled={pending}
                    aria-disabled={pending}
                />

                <DefaultInput
                    type="email"
                    name="email"
                    label="E-mail"
                    placeholder={initialProfile.email ?? "e.g. contact@example.com"}
                    disabled={pending}
                    aria-disabled={pending}
                />

                <div className="col-span-full">
                    <DefaultMarkdownEditor
                        label="Biography"
                        name="bio"
                        placeholder="Tell us about yourself..."
                        height={200}
                        maxLength={200}
                        value={bodyContent}
                        setValue={setBodyContent}
                    />
                </div>
                <div className="sm:col-span-3">
                    <DefaultInput
                        type="text"
                        name="company"
                        label="Company"
                        placeholder={initialProfile.company ?? "e.g. Acme Corp"}
                        disabled={pending}
                        aria-disabled={pending}
                    />
                </div>

                <div className="sm:col-span-3">
                    <DefaultInput
                        type="text"
                        name="jobTitle"
                        label="Job Title"
                        placeholder={initialProfile.jobTitle ?? "e.g. Software Engineer"}
                        disabled={pending}
                        aria-disabled={pending}
                    />
                </div>

                <DefaultInput
                    type="url"
                    name="website"
                    label="Website"
                    placeholder={initialProfile.website ?? "e.g. https://example.com"}
                    disabled={pending}
                    aria-disabled={pending}
                />

                <DefaultInput
                    type="text"
                    name="location"
                    label="Location"
                    placeholder={initialProfile.location ?? "e.g. San Francisco, CA"}
                    disabled={pending}
                    aria-disabled={pending}
                />

                <DefaultInput
                    type="text"
                    name="pronouns"
                    label="Pronouns"
                    placeholder={initialProfile.pronouns ?? "e.g. he/him, she/her, they/them"}
                    disabled={pending}
                    aria-disabled={pending}
                />
            </div>

            <div className="mt-6 grid gap-y-6">
                {formState.error && !Array.isArray(formState.error) && (
                    <ApplicationRequestFormError error={formState.error as ProblemDetails} />
                )}

                {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

                <DefaultButton type="submit" disabled={pending} aria-disabled={pending} width="fit">
                    {pending ? <Loading /> : "Save"}
                </DefaultButton>
            </div>
        </form>
    )
}
