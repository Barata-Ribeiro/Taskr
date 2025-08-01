import type { UserProfile } from "@/@types/user"
import getPublicProfile from "@/actions/user/get-public-profile"
import SafeMarkdown from "@/components/shared/SafeMarkdown"
import Avatar from "@/components/user/Avatar"
import Badge from "@/components/user/Badge"
import { auth } from "auth"
import { notFound, redirect } from "next/navigation"

interface ProfilePageProps {
    params: Promise<{ username: string; name: string }>
}

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
    const { username, name } = await params
    if (!username || !name) return notFound()

    const [session, state] = await Promise.all([auth(), await getPublicProfile(name)])

    if (!session) redirect("/auth/login")
    if (session.user?.username !== username) redirect(`/dashboard/${session.user?.username}/profile/${name}`)

    const profile = state.response?.data as UserProfile | undefined

    if (!profile) {
        return (
            <div
                className="flex min-h-[40vh] flex-col items-center justify-center text-center"
                role="status"
                aria-live="polite">
                <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">User profile not found.</span>
            </div>
        )
    }

    return (
        <section className="mx-auto max-w-2xl p-6 md:p-10" aria-label="User profile">
            <div className="grid grid-cols-[auto_1fr] items-start gap-4">
                <Avatar url={profile.avatarUrl} name={profile.displayName} size="extra-large" />
                <div className="flex w-full flex-col items-center gap-2 md:items-start">
                    <div className="inline-flex items-center gap-x-2">
                        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                        <Badge userRole={profile.role} />
                    </div>
                    <span className="text-gray-500 dark:text-gray-300">@{profile.username}</span>
                    {profile.fullName && (
                        <span className="text-sm text-gray-400 dark:text-gray-400">{profile.fullName}</span>
                    )}
                    <div className="my-2 w-full border-y border-gray-200 py-2 dark:border-gray-700">
                        <SafeMarkdown markdown={profile.bio ?? "No bio provided."} container={false} />
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="User statistics">
                <div
                    className="flex flex-col items-center rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                    aria-label="Projects participated">
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                        {profile.totalProjectsParticipated}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">Projects Participated</span>
                </div>
                <div
                    className="flex flex-col items-center rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                    aria-label="Projects created">
                    <span className="text-lg font-semibold text-green-600 dark:text-green-300">
                        {profile.totalCreatedProjects}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">Projects Created</span>
                </div>
                <div
                    className="flex flex-col items-center rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                    aria-label="Tasks assigned">
                    <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-300">
                        {profile.totalAssignedTasks}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">Tasks Assigned</span>
                </div>
                <div
                    className="flex flex-col items-center rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                    aria-label="Comments made">
                    <span className="text-lg font-semibold text-purple-600 dark:text-purple-300">
                        {profile.totalCommentsMade}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">Comments Made</span>
                </div>
            </div>
        </section>
    )
}
