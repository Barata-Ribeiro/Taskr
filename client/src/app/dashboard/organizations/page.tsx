import getAllOrganizationsPaginated from "@/actions/organizations/get-all-organizations-paginated"
import NewOrganizationCTA from "@/components/actions/new-organization-c-t-a"
import StateError from "@/components/feedback/state-error"
import NavigationPagination from "@/components/filters/navigation-pagination"
import SearchAndSortFilter from "@/components/filters/search-and-sort-filter"
import { Paginated, ProblemDetails } from "@/interfaces/actions"
import { Organization } from "@/interfaces/organization"
import parseDate from "@/utils/parse-date"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Organizations",
    description: "List of organizations available to the user in the application",
}

interface OrganizationsPageProps {
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function OrganizationsPage({ searchParams }: Readonly<OrganizationsPageProps>) {
    if (!searchParams) return null

    const search = (searchParams.search as string) || ""
    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "createdAt"

    const state = await getAllOrganizationsPaginated({ page, perPage, search, direction, orderBy })
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const pagination = state.response?.data as Paginated<Organization>
    const content = pagination.content ?? []
    const pageInfo = pagination.page

    return (
        <section id="organizations-list-section" aria-labelledby="organizations-list-title">
            <NewOrganizationCTA />

            <div className="mt-12">
                <div className="border-gray-200 pb-6 sm:flex sm:items-center sm:justify-between sm:border-b">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        Organizations{" "}
                        <span className="hidden text-sm text-gray-500 sm:ml-4 sm:inline-block">
                            {pageInfo.totalElements} result(s)
                        </span>
                    </h3>

                    <SearchAndSortFilter />
                </div>

                <div className="flow-root px-4 sm:mt-6 sm:px-0">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Website
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Members
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Location
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Founded
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {content.length > 0 &&
                                            content.map(organization => (
                                                <tr key={organization.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold sm:pl-6">
                                                        <Link
                                                            href={`/dashboard/organizations/${organization.id}`}
                                                            target="_self"
                                                            className="text-ebony-600 decoration-2 underline-offset-2 hover:text-ebony-700 hover:underline active:text-ebony-800">
                                                            {organization.name}
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {organization.websiteUrl ? (
                                                            <Link
                                                                href={organization.websiteUrl}
                                                                className="text-ebony-600 decoration-2 underline-offset-2 hover:text-ebony-700 hover:underline active:text-ebony-800"
                                                                target="_blank"
                                                                rel="noopener noreferrer external"
                                                                aria-label={`Visit ${organization.name}'s website`}
                                                                title={`Visit ${organization.name}'s website`}>
                                                                {organization.websiteUrl}
                                                            </Link>
                                                        ) : (
                                                            "N/A"
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {organization.membersCount}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {organization.location ?? "N/A"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {parseDate(organization.createdAt)}
                                                    </td>
                                                </tr>
                                            ))}

                                        {content.length < 1 && (
                                            <tr className="border-b border-gray-300 bg-white">
                                                <td
                                                    colSpan={6}
                                                    className="py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6 lg:pl-8">
                                                    No organizations found
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
            </div>
        </section>
    )
}
