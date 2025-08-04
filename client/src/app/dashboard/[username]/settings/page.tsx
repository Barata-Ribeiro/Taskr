import getPublicProfile from "@/actions/user/get-public-profile"
import UserUpdatePassForm from "@/components/forms/user/UserUpdatePassForm"
import UserUpdateProfileForm from "@/components/forms/user/UserUpdateProfileForm"
import DeleteAccountModal from "@/components/modals/DeleteAccountModal"
import UserUpdateProfileFormSkeleton from "@/components/ui/skeletons/UserUpdateProfileFormSkeleton"
import { auth } from "auth"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

interface SettingsPageProps {
    params: Promise<{ username: string }>
}

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your account settings",
}

export default async function SettingsPage({ params }: Readonly<SettingsPageProps>) {
    const [{ username }, session] = await Promise.all([params, auth()])

    if (!username) return notFound()
    if (!session) redirect("/auth/login")
    if (session.user.username !== username) redirect(`/dashboard/${session.user.username}/settings`)

    const profilePromise = getPublicProfile(session.user.username)

    return (
        <section aria-labelledby="settings-title">
            <h1 id="settings-title" className="sr-only">
                Account Settings
            </h1>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base/7 font-semibold">Personal Information</h2>
                        <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                            Use a permanent address where you can receive mail.
                        </p>
                    </div>

                    <Suspense fallback={<UserUpdateProfileFormSkeleton />}>
                        <UserUpdateProfileForm profilePromise={profilePromise} />
                    </Suspense>
                </div>

                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base/7 font-semibold">Change password</h2>
                        <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                            Update your password associated with your account.
                        </p>
                    </div>

                    <UserUpdatePassForm />
                </div>
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base/7 font-semibold">Delete account</h2>
                        <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                            No longer want to use our service? You can delete your account here. This action is not
                            reversible. All information related to this account will be deleted permanently.
                        </p>
                    </div>

                    <DeleteAccountModal />
                </div>
            </div>
        </section>
    )
}
