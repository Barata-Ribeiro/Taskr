import getUserProjectsByOrgId from "@/actions/projects/get-user-projects-by-org-id"
import getUserContext from "@/actions/user/get-user-context"
import BadgeProjectStatus from "@/components/badges/badge-project-status"
import StateError from "@/components/feedback/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { OrganizationProjects } from "@/interfaces/project"
import { UserContext } from "@/interfaces/user"
import parseDate from "@/utils/parse-date"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
import {
    FaArrowRightLong,
    FaBriefcase,
    FaCalendar,
    FaChevronRight,
    FaDiagramProject,
    FaLink,
    FaMapPin,
} from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

export async function generateMetadata() {
    const state = await getUserContext()
    if (!state) return { title: "Projects", description: "Projects page" }

    const data = state.response?.data as UserContext

    const title = data.context.fullName ?? data.context.displayName

    return {
        title: `${title}'s Projects`,
        description: `View all projects that you (${title}) are a member of.`,
    }
}

export default async function ProjectsPage() {
    const contextState = await getUserContext()
    if (!contextState.ok) return <StateError error={contextState.error as ProblemDetails} />

    const userData = contextState.response?.data as UserContext
    const orgIds = userData.organizationsWhereUserIsMember.map(org => org.id)

    const projectFetchPromises = orgIds.map(id => getUserProjectsByOrgId({ id }))
    const projectsStates = await Promise.all(projectFetchPromises)
    const failedFetch = projectsStates.find(state => !state.ok)
    if (failedFetch) return <StateError error={failedFetch.error as ProblemDetails} />

    const organizationProjects = projectsStates.map(state => state.response?.data as OrganizationProjects)

    return (
        <Fragment>
            {organizationProjects.map(data => (
                <section
                    key={data.organization.id}
                    className="rounded-md border-b border-gray-200 bg-white px-4 py-5 shadow-derek sm:px-6"
                    aria-labelledby={`organization-title-${data.organization.id}`}>
                    <header className="pb-5 lg:flex lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                            {/*ORG LOGO*/}
                            <div className="inline-flex items-center gap-2">
                                {data.organization.logoUrl ? (
                                    <Image
                                        className="flex-shrink-0 rounded-full bg-ebony-200 object-cover shadow-sm"
                                        src={data.organization.logoUrl}
                                        title={`${data.organization.name} logo`}
                                        alt={`${data.organization.name} logo`}
                                        width={48}
                                        height={48}
                                        sizes="48px"
                                        priority
                                    />
                                ) : (
                                    <div
                                        className="flex h-12 w-12 flex-shrink-0 select-none items-center justify-center rounded-full bg-ebony-200 shadow-sm"
                                        aria-label={`${data.organization.name} logo placeholder`}>
                                        <span className="font-heading text-xl text-ebony-500">
                                            {data.organization.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <h2
                                    id={`organization-title-${data.organization.id}`}
                                    className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                    {data.organization.name}
                                </h2>
                            </div>

                            {/*ORG INFO*/}
                            <div
                                className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6"
                                aria-label={`Organization description: ${data.organization.description}`}
                                title={data.organization.description}>
                                <span className="mt-2 flex items-center text-sm text-gray-500">
                                    <FaBriefcase
                                        aria-hidden="true"
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                    />
                                    <p className="max-w-36 truncate">{data.organization.description}</p>
                                </span>
                                <span
                                    className="mt-2 flex items-center text-sm text-gray-500"
                                    aria-label={`Organization location: ${data.organization.location}`}>
                                    <FaMapPin
                                        aria-hidden="true"
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                    />
                                    {data.organization.location ?? "N/A"}
                                </span>
                                <div
                                    className="mt-2 flex items-center text-sm text-gray-500"
                                    aria-label={`Organization projects count: ${data.organization.projectsCount}`}>
                                    <FaDiagramProject
                                        aria-hidden="true"
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                    />
                                    Projects ({data.organization.projectsCount})
                                </div>
                                <time
                                    dateTime={data.organization.createdAt}
                                    className="mt-2 flex items-center text-sm text-gray-500">
                                    <FaCalendar
                                        aria-hidden="true"
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                    />
                                    Created on {parseDate(data.organization.createdAt)}
                                </time>
                            </div>
                        </div>
                        <div className="mt-5 flex gap-3 lg:ml-4 lg:mt-0">
                            <Link
                                href={data.organization.websiteUrl ?? "#"}
                                className={twMerge(
                                    "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                                    data.organization.websiteUrl
                                        ? "cursor-pointer"
                                        : "pointer-events-none cursor-default opacity-50",
                                )}>
                                <FaLink aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" />
                                Site
                            </Link>

                            <Link
                                href={`/dashboard/organizations/${data.organization.id}`}
                                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                View Page
                                <FaArrowRightLong aria-hidden="true" className="h-5 w-5 text-inherit" />
                            </Link>
                        </div>
                    </header>

                    {data.projects.length > 0 ? (
                        <ul className="divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-900/5">
                            {data.projects.map(pivot => {
                                const orgId = data.organization.id
                                const projectKey = pivot.project.name + "_" + pivot.project.id
                                const projectUrl = `/dashboard/projects/${pivot.project.id}?orgId=${orgId}`
                                return (
                                    <li
                                        key={projectKey}
                                        className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
                                        aria-labelledby={`project-${projectKey}-title`}>
                                        <div className="min-w-0">
                                            <div className="flex items-start gap-x-3">
                                                <h3
                                                    id={`project-${projectKey}-title`}
                                                    className="text-sm font-semibold leading-6 text-gray-900">
                                                    <Link href={projectUrl}>
                                                        <span className="absolute inset-x-0 -top-px bottom-0" />
                                                        {pivot.project.name}
                                                    </Link>
                                                </h3>

                                                <BadgeProjectStatus status={pivot.status} type="text-only" />
                                            </div>
                                            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                                <p className="whitespace-nowrap">
                                                    Due on{" "}
                                                    <time dateTime={pivot.project.deadline}>
                                                        {parseDate(pivot.project.deadline)}
                                                    </time>
                                                </p>
                                                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                                    <circle r={1} cx={1} cy={1} />
                                                </svg>
                                                <p className="truncate">
                                                    {pivot.project.membersCount} member(s), {pivot.project.tasksCount}{" "}
                                                    task(s)
                                                </p>
                                            </div>
                                        </div>

                                        <FaChevronRight
                                            aria-hidden="true"
                                            className="h-3 w-3 flex-none text-gray-400"
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <div className="rounded-md bg-white shadow-sm ring-1 ring-gray-900/5">
                            <div className="relative flex justify-between gap-x-6 px-4 py-5 sm:px-6">
                                <p className="text-base font-semibold leading-6 text-gray-900">
                                    There are no projects in this organization yet
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            ))}
        </Fragment>
    )
}
