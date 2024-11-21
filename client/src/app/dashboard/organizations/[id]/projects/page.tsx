import getOrganizationProjectsById from "@/actions/organizations/get-organization-projects-by-id"
import BadgeProjectStatus from "@/components/badges/badge-project-status"
import StateError from "@/components/feedback/state-error"
import NavigationPagination from "@/components/filters/navigation-pagination"
import TableCompleteFilter from "@/components/filters/table-complete-filter"
import { ProblemDetails } from "@/interfaces/actions"
import { OrganizationProjectsList } from "@/interfaces/organization"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import { notFound } from "next/navigation"

interface OrganizationProjectsPageProps {
    params: {
        id: string
    }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Readonly<OrganizationProjectsPageProps>) {
    const state = await getOrganizationProjectsById({
        id: params.id,
        page: 0,
        perPage: 10,
        search: "",
        direction: "ASC",
        orderBy: "createdAt",
    })
    if (!state.ok) return { title: "Organization Members", description: "Organization members list" }

    const data = state.response?.data as OrganizationProjectsList
    const organization = data.organization

    return {
        title: `Projects of ${organization.name}`,
        description: `Listing all projects of the ${organization.name} organization, with the ability to search and sort the list.`,
    }
}

export default async function OrganizationProjectsPage({
    params,
    searchParams,
}: Readonly<OrganizationProjectsPageProps>) {
    if (!params) return notFound()
    if (!searchParams) return null

    const search = (searchParams.search as string) || ""
    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "createdAt"

    const state = await getOrganizationProjectsById({ id: params.id, search, page, perPage, direction, orderBy })
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const data = state.response?.data as OrganizationProjectsList

    const organization = data.organization
    const pagination = data.projects
    const content = pagination.content ?? []
    const pageInfo = pagination.page

    return (
        <section
            id="organization-projects-list"
            aria-labelledby="organization-projects-list-title"
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <header className="border-b border-gray-200 py-12 text-center">
                <h1 id="organization-members-list-title" className="text-4xl font-bold tracking-tight text-gray-900">
                    Projects of {organization.name}
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
                    Listing all projects of the {organization.name} organization, with the ability to search and sort
                    the list.
                </p>
            </header>

            <TableCompleteFilter filterType="projects" />

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Id
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Title
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Members Count
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Tasks Count
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Deadline
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">View Project</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {content.map((pivot, idx) => (
                                        <tr key={idx} className="border-b border-gray-300">
                                            <td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 lg:pl-8">
                                                {pivot.project.id}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-900">{pivot.project.name}</td>
                                            <td className="px-3 py-4 text-sm text-gray-900">
                                                {pivot.project.membersCount}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-900">
                                                {pivot.project.tasksCount}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-900">
                                                {parseDate(pivot.project.deadline)}
                                            </td>
                                            <td className="px-3 py-4">
                                                <BadgeProjectStatus type="text-only" status={pivot.status} />
                                            </td>
                                            <td align="right" className="py-4 pl-3 pr-4 sm:pr-6">
                                                <Link
                                                    href={`/dashboard/organizations/${organization.id}/projects/${pivot.project.id}`}
                                                    className="inline-block w-max rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100">
                                                    View project
                                                    <span className="sr-only">, {pivot.project.name}</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}

                                    {content.length < 1 && (
                                        <tr className="border-b border-gray-300 bg-white">
                                            <td
                                                colSpan={6}
                                                className="py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6 lg:pl-8">
                                                No projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <NavigationPagination usePageInfo={pageInfo} contentSize={content.length} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
