import getOrganizationById from "@/actions/organizations/get-organization-by-id"
import getOrganizationMembersById from "@/actions/organizations/get-organization-members-by-id"
import getOrganizationProjectsById from "@/actions/organizations/get-organization-projects-by-id"
import getUserContext from "@/actions/user/get-user-context"
import StateError from "@/components/feedback/state-error"
import StackedOrganizationMembersList from "@/components/lists/stacked-organization-members-list"
import StackedOrganizationProjectsList from "@/components/lists/stacked-organization-projects-list"
import { ProblemDetails } from "@/interfaces/actions"
import { Organization, OrganizationMembersList, OrganizationProjectsList } from "@/interfaces/organization"
import { UserContext } from "@/interfaces/user"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FaArrowRightLong } from "react-icons/fa6"

interface OrganizationPageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: Readonly<OrganizationPageProps>) {
    const state = await getOrganizationById({ id: params.id })
    if (!state.ok) return notFound()

    const data = state.response?.data as Organization

    return {
        title: data.name,
        description: `Page of organization ${data.name}. ${data.description}`,
    }
}

function OrganizationLogo(props: Readonly<{ data: Organization }>) {
    return (
        <>
            {props.data.logoUrl ? (
                <Image
                    className="h-24 w-24 flex-shrink-0 rounded-full bg-ebony-200 object-cover shadow-derek"
                    src={props.data.logoUrl}
                    title={`${props.data.name} logo`}
                    alt={`${props.data.name} logo`}
                    width={96}
                    height={96}
                    sizes="96px"
                    priority
                />
            ) : (
                <div
                    className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-ebony-200"
                    aria-label={`${props.data.name} logo placeholder`}>
                    <span className="font-heading text-4xl text-ebony-500">{props.data.name.charAt(0)}</span>
                </div>
            )}
        </>
    )
}

export default async function OrganizationPage({ params }: Readonly<OrganizationPageProps>) {
    if (!params.id) return notFound()

    const membersState = getOrganizationMembersById({
        id: params.id,
        page: 0,
        perPage: 10,
        search: null,
        direction: "ASC",
        orderBy: "username",
    })
    const projectsState = getOrganizationProjectsById({
        id: params.id,
        page: 0,
        perPage: 10,
        search: null,
        direction: "ASC",
        orderBy: "createdAt",
    })
    const contextState = getUserContext()

    const [context, members, projects] = await Promise.all([contextState, membersState, projectsState])
    if (!members.ok || !projects.ok || !context.ok) {
        const error = (members.error ?? projects.error ?? context.error) as ProblemDetails
        return <StateError error={error} />
    }

    const contextData = context.response?.data as UserContext
    const { organization: data, ...membersData } = members.response?.data as OrganizationMembersList
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organization: _, ...projectsData } = projects.response?.data as OrganizationProjectsList

    const isOrgOwner = data.id === contextData.organizationsWhereUserIsMember.find(org => org.isOwner)?.id
    const isOrgAdmin = data.id === contextData.organizationsWhereUserIsMember.find(org => org.isAdmin)?.id

    return (
        <article id="organizations-org-info" aria-labelledby="organizations-org-info-title">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Org Header */}
                <header className="flex flex-wrap items-center gap-6">
                    <OrganizationLogo data={data} />
                    <div>
                        <h1
                            id="organizations-org-info-title"
                            className="font-heading text-4xl font-bold text-ebony-900">
                            {data.name}
                        </h1>
                        {data.location && <p className="mt-2 text-lg text-ebony-600">{data.location}</p>}
                    </div>
                </header>

                {/* Organization Description */}
                {data.description && <p className="mt-8 text-base text-gray-700">{data.description}</p>}

                {/* Statistics */}
                <section className="mt-8">
                    <dl className="flex space-x-12">
                        <div className="text-center">
                            <dt className="font-heading text-3xl font-semibold text-gray-900">{data.projectsCount}</dt>
                            <dd className="text-gray-500">Projects</dd>
                        </div>
                        <div className="text-center">
                            <dt className="font-heading text-3xl font-semibold text-gray-900">{data.membersCount}</dt>
                            <dd className="text-gray-500">Members</dd>
                        </div>
                    </dl>
                </section>

                {/* External Links */}
                {data.websiteUrl && (
                    <div className="mt-8">
                        <Link
                            href={data.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer external"
                            aria-label={`Visit ${data.name}'s website at ${data.websiteUrl}`}
                            title={`Visit ${data.name}'s website at ${data.websiteUrl}`}
                            className="text-base font-medium text-english-holly-600 decoration-2 underline-offset-4 hover:text-english-holly-700 hover:underline active:text-english-holly-800">
                            Visit our website
                        </Link>
                    </div>
                )}

                {/* Members Section */}
                <section className="mt-12" aria-labelledby="members-section-title">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 id="members-section-title" className="font-heading text-2xl font-bold text-ebony-900">
                            Members
                        </h2>
                        {/* */}
                        <Link
                            href={`/dashboard/organizations/${params.id}/members`}
                            aria-label={`List all members of ${data.name}`}
                            title={`List all members of ${data.name}`}
                            className="inline-flex items-center gap-2 text-base font-medium text-english-holly-600 decoration-2 underline-offset-4 hover:text-english-holly-700 hover:underline active:text-english-holly-800">
                            List all <FaArrowRightLong aria-hidden="true" className="h-3 w-3 flex-none text-inherit" />
                        </Link>
                    </div>

                    <StackedOrganizationMembersList data={membersData.members} />
                </section>

                {/* Projects Section */}
                <section className="mt-12" aria-labelledby="projects-section-title">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 id="projects-section-title" className="font-heading text-2xl font-bold text-ebony-900">
                            Projects
                        </h2>
                        {/* */}
                        <div className="inline-flex items-center gap-2">
                            {(isOrgOwner || isOrgAdmin) && (
                                <Link
                                    href={`/dashboard/organizations/${params.id}/projects/new`}
                                    aria-label={`Create a new project in ${data.name}`}
                                    title={`Create a new project in ${data.name}`}
                                    className="w-max rounded-md bg-ebony-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ebony-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 active:bg-ebony-800">
                                    Create new
                                </Link>
                            )}

                            <Link
                                href={`/dashboard/organizations/${params.id}/projects`}
                                aria-label={`List all projects of ${data.name}`}
                                title={`List all projects of ${data.name}`}
                                className="inline-flex items-center gap-2 text-base font-medium text-english-holly-600 decoration-2 underline-offset-4 hover:text-english-holly-700 hover:underline active:text-english-holly-800">
                                List all{" "}
                                <FaArrowRightLong aria-hidden="true" className="h-3 w-3 flex-none text-inherit" />
                            </Link>
                        </div>
                    </div>

                    {projectsData.projects.content.length > 0 ? (
                        <StackedOrganizationProjectsList orgId={params.id} data={projectsData.projects} />
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
            </div>
        </article>
    )
}
