import adminGetUserByUsername from "@/actions/admin/admin-get-user-by-username"
import AdminToggleBanButton from "@/components/admin/buttons/AdminToggleBanButton"
import AdminToggleVerificationButton from "@/components/admin/buttons/AdminToggleVerificationButton"
import AdminUpdateProfileForm from "@/components/forms/admin/AdminUpdateProfileForm"
import UserUpdateProfileFormSkeleton from "@/components/ui/skeletons/UserUpdateProfileFormSkeleton"
import { auth } from "auth"
import { MoveLeftIcon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Fragment, Suspense } from "react"

interface UserPageProps {
    params: Promise<{ username: string; user: string }>
}

export async function generateMetadata({ params }: Readonly<UserPageProps>): Promise<Metadata> {
    const { user } = await params

    return {
        title: `Managing User '${user}'`,
        description: `Admin settings for user '${user}' in your dashboard.`,
    }
}

export default async function UserPage({ params }: Readonly<UserPageProps>) {
    const [{ username, user }, session] = await Promise.all([params, auth()])

    if (!username || !user) return notFound()
    if (!session) return redirect("/auth/login")
    if (session.user.username !== username || session.user.username === user) {
        return redirect(`/dashboard/${session.user.username}/settings`)
    }
    if (session.user.role !== "ADMIN") return redirect(`/dashboard/${session.user.username}`)

    const userPromise = adminGetUserByUsername(user)

    const baseUrl = `/dashboard/${session.user.username}`
    const baseAdminUrl = `${baseUrl}/admin/users`
    const backLinkLabel = "Back to User Management"

    return (
        <Fragment>
            <header className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-700">
                <Link
                    href={baseAdminUrl}
                    aria-label={backLinkLabel}
                    title={backLinkLabel}
                    className="mb-4 inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <MoveLeftIcon aria-hidden size={16} /> {backLinkLabel}
                </Link>

                <h1 className="mb-4 text-2xl font-bold">User Management</h1>
                <p className="mb-6">
                    Manage user details for <strong>{user}</strong>.
                </p>
            </header>

            <section aria-labelledby="user-management-title">
                <h2 id="user-management-title" className="sr-only">
                    User Management
                </h2>

                <div className="space-y-16 divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-base/7 font-semibold">Personal Information</h2>
                            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                                Update the user&#39;s personal details such as name, username, display name and avatar.
                            </p>
                        </div>

                        <Suspense fallback={<UserUpdateProfileFormSkeleton />}>
                            <AdminUpdateProfileForm profilePromise={userPromise} />
                        </Suspense>
                    </div>

                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-base/7 font-semibold">Actions</h2>
                            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                                Toggle user-specific actions such as verification status, account ban, etc.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-y-4 md:col-span-2">
                            <div className="inline-flex items-center gap-x-4">
                                Verification Status:{" "}
                                <span className="text-green-600! dark:text-green-400!">
                                    <AdminToggleVerificationButton username={user} session={session} />
                                </span>
                            </div>

                            <div className="inline-flex items-center gap-x-4">
                                Account Status:{" "}
                                <span className="text-red-600! dark:text-red-400!">
                                    <AdminToggleBanButton username={user} session={session} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-base/7 font-semibold">
                                Delete account{" "}
                                <span className="font-medium text-red-600 dark:text-red-400">(Danger Zone)</span>
                            </h2>
                            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                                Permanently delete this user and all associated data. This action cannot be undone as it
                                isn&#39;t a soft delete.{" "}
                                <strong>It requires you to type in the user&#39;s username to confirm.</strong>
                            </p>
                        </div>

                        {/*TODO: Add AdminDeleteAccountModal with account data*/}
                    </div>
                </div>
            </section>
        </Fragment>
    )
}
