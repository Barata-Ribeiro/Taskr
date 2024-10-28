import getOrganizationById from "@/actions/organizations/get-organization-by-id"
import getOrganizationMembersById from "@/actions/organizations/get-organization-members-by-id"
import getOrganizationProjectsById from "@/actions/organizations/get-organization-projects-by-id"
import StateError from "@/components/feedback/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { Organization, OrganizationMembersList, OrganizationProjectsList } from "@/interfaces/organization"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

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

export default async function OrganizationPage({ params }: Readonly<OrganizationPageProps>) {
    if (!params.id) return notFound()

    const membersState = getOrganizationMembersById({ id: params.id })
    const projectsState = getOrganizationProjectsById({ id: params.id })

    const [members, projects] = await Promise.all([membersState, projectsState])
    if (!members.ok) return <StateError error={members.error as ProblemDetails} />
    if (!projects.ok && (projects.error as ProblemDetails).status !== 404) {
        return <StateError error={projects.error as ProblemDetails} />
    }

    const { organization: data, ...membersData } = members.response?.data as OrganizationMembersList
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organization: _, ...projectsData } = projects.response?.data as OrganizationProjectsList

    return (
        <article id="organizations-org-info" aria-labelledby="organizations-org-info-title">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Org Header */}
                <header className="flex items-center space-x-6">
                    {data.logoUrl ? (
                        <Image
                            className="h-24 w-24 flex-shrink-0 rounded-full bg-ebony-200 object-cover shadow-derek"
                            src={data.logoUrl}
                            title={`${data.name} logo`}
                            alt={`${data.name} logo`}
                            width={96}
                            height={96}
                            sizes="96px"
                            priority
                        />
                    ) : (
                        <div
                            className="flex h-24 w-24 items-center justify-center rounded-full bg-ebony-200"
                            aria-label={`${data.name} logo placeholder`}>
                            <span className="font-heading text-4xl text-ebony-500">{data.name.charAt(0)}</span>
                        </div>
                    )}
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
                {data.description && (
                    <div className="mt-8">
                        <p className="text-base text-ebony-700">{data.description}</p>
                    </div>
                )}

                {/* Estatísticas */}
                <section className="mt-8">
                    <dl className="flex space-x-12">
                        <div className="text-center">
                            <dt className="font-heading text-3xl font-semibold text-ebony-900">{data.projectsCount}</dt>
                            <dd className="text-ebony-500">Projects</dd>
                        </div>
                        <div className="text-center">
                            <dt className="font-heading text-3xl font-semibold text-ebony-900">{data.membersCount}</dt>
                            <dd className="text-ebony-500">Members</dd>
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

                {/* Projects Section */}
                <section className="mt-12" aria-labelledby="projects-section-title">
                    <h2 id="projects-section-title" className="font-heading text-2xl font-bold text-ebony-900">
                        Projects
                    </h2>
                    <p className="mt-4 text-ebony-500">Soon, the projects of the organization will be listed here.</p>
                </section>

                {/* Members Section */}
                <section className="mt-12" aria-labelledby="members-section-title">
                    <h2 id="members-section-title" className="font-heading text-2xl font-bold text-ebony-900">
                        Members
                    </h2>
                    <p className="mt-4 text-ebony-500">Soon, the members of the organization will be listed here.</p>
                </section>
            </div>
        </article>
    )
}
