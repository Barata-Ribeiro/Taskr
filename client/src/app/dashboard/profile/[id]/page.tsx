import getUserPublicProfile from "@/actions/user/get-user-public-profile"
import BadgePillWithDot from "@/components/badges/badge-pill-with-dot"
import StateError from "@/components/feedback/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { Profile } from "@/interfaces/user"
import parseDate from "@/utils/parse-date"
import Image from "next/image"
import Link from "next/link"

interface ProfilePageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: Readonly<ProfilePageProps>) {
    const profileState = await getUserPublicProfile({ id: params.id })
    if (profileState.error) return { title: "Profile", description: "Public profile of a user on the platform." }

    const data = profileState.response?.data as Profile

    return {
        title: data.profile.fullName ?? data.profile.displayName,
        description: `Public profile of ${data.profile.username} on the platform.`,
    }
}

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
    const profileState = await getUserPublicProfile({ id: params.id })
    if (profileState.error) return <StateError error={profileState.error as ProblemDetails} />

    const data = profileState.response?.data as Profile

    return (
        <div id="public-profile" aria-labelledby="public-profile-title">
            <header className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold leading-6 text-gray-900" id="public-profile-title">
                    Profile
                </h2>
                <p className="mt-2 max-w-4xl text-base text-gray-500">
                    You are viewing the profile of {data.profile.username}. These are public details available to all
                    users of the platform.
                </p>
            </header>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <section
                    id="public-profile-details"
                    aria-labelledby="public-profile-details-title"
                    className="rounded-md bg-white p-4 shadow-derek">
                    {data.profile.avatarUrl ? (
                        <Image
                            src={data.profile.avatarUrl}
                            alt={`${data.profile.fullName ?? data.profile.displayName} avatar`}
                            className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-gray-200 shadow-sm"
                            width={64}
                            height={64}
                            sizes="64px"
                        />
                    ) : (
                        <span
                            className="inline-flex h-16 w-16 flex-shrink-0 select-none items-center justify-center rounded-full bg-gray-200 shadow-sm"
                            aria-label={`${data.profile.fullName ?? data.profile.displayName} avatar placeholder`}>
                            <span className="font-heading text-3xl text-gray-500">
                                {(data.profile.fullName ?? data.profile.displayName).charAt(0)}
                            </span>
                        </span>
                    )}

                    <h3
                        className="mt-2 text-lg font-semibold leading-6 text-gray-900"
                        id="public-profile-details-title">
                        {data.profile.fullName ?? data.profile.displayName}
                    </h3>

                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">
                        <div>
                            <dt className="font-semibold">Username</dt>
                            <dd>{data.profile.username}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold">Email</dt>
                            <dd>
                                <Link
                                    href={`mailto:${data.profile.email}`}
                                    className="underline-offset-2 hover:text-gray-600 hover:underline active:text-gray-700">
                                    {data.profile.email}
                                </Link>
                            </dd>
                        </div>
                        <div className="space-y-1">
                            <dt className="font-semibold">Application Role</dt>
                            <BadgePillWithDot role={data.profile.role} />
                        </div>
                        <div>
                            <dt className="font-semibold">Joined</dt>
                            <dd>{parseDate(data.profile.createdAt)}</dd>
                        </div>
                    </dl>
                </section>
            </div>
        </div>
    )
}
