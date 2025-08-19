import type { UserProfile } from "@/@types/user"
import getPublicProfile from "@/actions/user/get-public-profile"
import SafeMarkdown from "@/components/shared/SafeMarkdown"
import Avatar from "@/components/user/Avatar"
import Badge from "@/components/user/Badge"
import VerifiedBadge from "@/components/user/VerifiedBadge"
import { auth } from "auth"
import { BriefcaseIcon, Building2Icon, LinkIcon, MapPinIcon } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

interface ProfilePageProps {
    params: Promise<{ username: string; name: string }>
}

export async function generateMetadata({ params }: Readonly<ProfilePageProps>): Promise<Metadata> {
    const { username, name } = await params
    if (!username || !name) return {}

    const profile = await getPublicProfile(name)
    const userProfile = profile.response?.data as UserProfile | undefined

    if (!userProfile) return {}

    return {
        title: `${userProfile.displayName} (@${userProfile.username}) - Profile`,
        description: userProfile.bio || "No bio provided.",
        openGraph: {
            title: `${userProfile.displayName} (@${userProfile.username}) - Profile`,
            description: userProfile.bio || "No bio provided.",
            images: userProfile.avatarUrl ? [userProfile.avatarUrl] : [],
        },
    }
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
        <section className="mx-auto max-w-3xl p-0 md:p-0" aria-label="User profile">
            {/* Cover image */}
            {profile.coverUrl && (
                <div className="relative h-40 w-full overflow-hidden rounded-b-lg md:h-56">
                    <Image
                        src={profile.coverUrl}
                        fill
                        alt="Profile cover"
                        quality={75}
                        sizes="100vw"
                        priority
                        className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            )}

            <div className="relative z-10 mx-auto flex flex-col gap-4 px-6 pt-4 md:flex-row md:items-end md:gap-8 md:px-10">
                {/* Avatar */}
                <div className="-mt-12 flex-shrink-0 md:-mt-16">
                    <Avatar url={profile.avatarUrl} name={profile.displayName} size="extra-large" />
                </div>
                {/* Main info */}
                <div className="flex flex-1 flex-col items-center gap-2 md:items-start">
                    <div className="inline-flex items-center gap-x-2">
                        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                        <Badge userRole={profile.role} />
                    </div>
                    <span className="inline-flex items-center gap-x-2 text-gray-500 dark:text-gray-300">
                        @{profile.username} {profile.isVerified && <VerifiedBadge />}
                    </span>
                    {profile.fullName && (
                        <span className="text-sm text-gray-400 dark:text-gray-400">{profile.fullName}</span>
                    )}
                    {/* Pronouns */}
                    {profile.pronouns && (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {profile.pronouns}
                        </span>
                    )}
                    {/* Job title and company */}
                    {(profile.jobTitle || profile.company) && (
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            {profile.jobTitle && (
                                <span className="inline-flex items-center gap-1">
                                    <BriefcaseIcon aria-hidden size={16} />
                                    {profile.jobTitle}
                                </span>
                            )}
                            {profile.company && (
                                <span className="inline-flex items-center gap-1">
                                    <Building2Icon aria-hidden size={16} />
                                    {profile.company}
                                </span>
                            )}
                        </div>
                    )}
                    {/* Location, Website */}
                    {profile.location ||
                        (profile.website && (
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                {profile.location && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPinIcon aria-hidden size={16} />
                                        {profile.location}
                                    </span>
                                )}
                                {profile.website && (
                                    <Link
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-x-1">
                                        <LinkIcon aria-hidden size={16} />
                                        <span className="text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                                            Website
                                        </span>
                                    </Link>
                                )}
                            </div>
                        ))}
                </div>
            </div>

            {/* Bio */}
            <div className="mx-auto mt-6 max-w-2xl px-6 md:px-10">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <SafeMarkdown markdown={profile.bio ?? "No bio provided."} container={false} />
                </div>
            </div>

            {/* Stats */}
            <div
                className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 px-6 md:grid-cols-4 md:px-10"
                aria-label="User statistics">
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
