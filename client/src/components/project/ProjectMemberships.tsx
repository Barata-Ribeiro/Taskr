import { ProblemDetails } from "@/@types/application"
import getProjectById from "@/actions/project/get-project-by-id"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import ProjectRoleBadge from "@/components/shared/project/ProjectRoleBadge"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import Avatar from "@/components/user/Avatar"
import VerifiedBadge from "@/components/user/VerifiedBadge"
import dateFormatter from "@/utils/date-formatter"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

interface ProjectMembershipsProps {
    id: number
    baseUrl: string
}

export default async function ProjectMemberships({ id, baseUrl }: Readonly<ProjectMembershipsProps>) {
    const projectResponse = await getProjectById(id)

    if (!projectResponse.ok || !projectResponse.response?.data) {
        const isProblemDetails = (projectResponse.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (projectResponse.error as ProblemDetails).detail
            : "An error occurred while fetching the project details."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const project = projectResponse.response.data
    const memberships = project.memberships

    return (
        <section
            className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800"
            aria-labelledby="project-membership-heading"
            tabIndex={-1}>
            <div className="px-4 pt-4 sm:flex-1 sm:px-6 sm:pt-6">
                <h2 id="project-membership-heading" className="text-xl font-semibold" tabIndex={-1}>
                    Team Members
                </h2>
                <p className="mt-1 truncate text-gray-500 dark:text-gray-400" id="project-membership-desc">
                    People working on this project
                </p>
            </div>

            <ul
                className="mt-6 divide-y divide-gray-100 border-t border-gray-100 p-4 sm:p-6 dark:border-gray-700"
                aria-labelledby="project-membership-heading"
                aria-describedby="project-membership-desc">
                {memberships.map(membership => (
                    <li
                        key={membership.user.username}
                        className="relative flex justify-between gap-x-6 rounded-lg px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8 dark:hover:bg-gray-700"
                        aria-label={`${membership.user.displayName} (${membership.role})`}>
                        <div className="inline-flex min-w-0 items-center gap-x-4">
                            <Avatar
                                url={membership.user.avatarUrl}
                                name={membership.user.displayName}
                                size="large"
                                aria-label={`Avatar of ${membership.user.displayName}`}
                            />
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm/6 font-semibold">
                                    <Link
                                        href={`${baseUrl}/profile/${membership.user.username}`}
                                        className="inline-flex items-center gap-x-2 hover:underline"
                                        aria-label={`View profile of ${membership.user.displayName}`}>
                                        {membership.user.displayName} {membership.user.isVerified && <VerifiedBadge />}
                                    </Link>
                                </p>
                                <p
                                    className="mt-1 truncate text-xs/5 text-gray-500"
                                    aria-label={`Username: ${membership.user.username}`}>
                                    @{membership.user.username}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-x-4">
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                                <ProjectRoleBadge role={membership.role} />
                                <p className="mt-1 text-xs/5 text-gray-500">
                                    Joined at{" "}
                                    <time
                                        dateTime={membership.joinedAt}
                                        aria-label={`Joined at ${dateFormatter(membership.joinedAt)}`}>
                                        {dateFormatter(membership.joinedAt)}
                                    </time>
                                </p>
                            </div>
                            <DefaultLinkButton
                                href={`${baseUrl}/profile/${membership.user.username}`}
                                width="fit"
                                isIconOnly
                                buttonType="ghost"
                                aria-label={`Go to ${membership.user.displayName}'s profile`}>
                                <ChevronRightIcon aria-hidden size={20} />
                            </DefaultLinkButton>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
