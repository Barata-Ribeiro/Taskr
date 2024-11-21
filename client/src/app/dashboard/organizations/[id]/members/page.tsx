import getOrganizationMembersById from "@/actions/organizations/get-organization-members-by-id"
import BadgePillWithDot from "@/components/badges/badge-pill-with-dot"
import StateError from "@/components/feedback/state-error"
import NavigationPagination from "@/components/filters/navigation-pagination"
import TableCompleteFilter from "@/components/filters/table-complete-filter"
import Avatar from "@/components/helpers/avatar"
import { ProblemDetails } from "@/interfaces/actions"
import { OrganizationMembersList } from "@/interfaces/organization"
import { OrganizationMember } from "@/interfaces/user"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import { notFound } from "next/navigation"

interface MembersPageProps {
    params: {
        id: string
    }
    searchParams?: { [key: string]: string | string[] | undefined }
}

function MemberBadge(props: Readonly<{ pivot: OrganizationMember }>) {
    return (
        <>
            {props.pivot.roles.includes("Owner") ? (
                <span className="inline-flex select-none items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    Owner
                </span>
            ) : (
                ((props.pivot.roles.includes("Admin") && (
                    <span className="inline-flex select-none items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Admin
                    </span>
                )) ?? (
                    <span className="inline-flex select-none items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Member
                    </span>
                ))
            )}
        </>
    )
}

export async function generateMetadata({ params }: Readonly<MembersPageProps>) {
    const state = await getOrganizationMembersById({
        id: params.id,
        page: 0,
        perPage: 10,
        search: "",
        direction: "ASC",
        orderBy: "createdAt",
    })
    if (!state.ok) return { title: "Organization Members", description: "Organization members list" }

    const data = state.response?.data as OrganizationMembersList
    const organization = data.organization

    return {
        title: `Members of ${organization.name}`,
        description: `Listing all members of the ${organization.name} organization, with the ability to search and sort the list.`,
    }
}

export default async function MembersPage({ params, searchParams }: Readonly<MembersPageProps>) {
    if (!params) return notFound()
    if (!searchParams) return null

    const search = (searchParams.search as string) || ""
    const page = parseInt(searchParams.page as string, 10) || 0
    const perPage = parseInt(searchParams.perPage as string, 10) || 10
    const direction = (searchParams.direction as string) || "ASC"
    const orderBy = (searchParams.orderBy as string) || "createdAt"

    const state = await getOrganizationMembersById({ id: params.id, page, perPage, search, direction, orderBy })
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const data = state.response?.data as OrganizationMembersList

    const organization = data.organization
    const pagination = data.members
    const content = pagination.content ?? []
    const pageInfo = pagination.page

    return (
        <section
            id="organization-members-list"
            aria-labelledby="organization-members-list-title"
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <header className="border-b border-gray-200 py-12 text-center">
                <h1 id="organization-members-list-title" className="text-4xl font-bold tracking-tight text-gray-900">
                    Members of {organization.name}
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
                    Listing all members/employees of the {organization.name} organization, with the ability to search
                    and sort the list.
                </p>
            </header>

            <TableCompleteFilter filterType="members" />

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
                                            Email
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Organization Role
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Role
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Exists Since
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {content.length > 0 &&
                                        content.map(pivot => (
                                            <tr key={pivot.user.email}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <div className="flex items-center gap-4 rounded-md">
                                                        <Avatar
                                                            name={pivot.user.fullName ?? pivot.user.displayName}
                                                            size={48}
                                                            src={pivot.user.avatarUrl}
                                                        />

                                                        <div className="grid">
                                                            <p className="font-heading font-medium text-gray-900">
                                                                <Link
                                                                    href={`/dashboard/profile/${pivot.user.id}`}
                                                                    target="_self"
                                                                    aria-label={`View ${pivot.user.fullName ?? pivot.user.displayName}'s profile`}
                                                                    title={`View ${pivot.user.fullName ?? pivot.user.displayName}'s profile`}
                                                                    className="text-ebony-600 underline-offset-2 hover:text-ebony-700 hover:underline active:text-ebony-800">
                                                                    @{pivot.user.username}
                                                                </Link>
                                                            </p>
                                                            <div className="mt-1 text-gray-500">
                                                                {pivot.user.fullName ?? pivot.user.displayName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="text-gray-900">
                                                        <Link
                                                            href={`mailto:${pivot.user.email}`}
                                                            className="relative truncate text-ebony-600 underline-offset-2 hover:text-ebony-700 hover:underline active:text-ebony-800">
                                                            {pivot.user.email}
                                                        </Link>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <MemberBadge pivot={pivot} />
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <BadgePillWithDot role={pivot.user.role} />
                                                </td>

                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {parseDate(pivot.user.createdAt)}
                                                </td>
                                            </tr>
                                        ))}

                                    {content.length < 1 && (
                                        <tr className="border-b border-gray-300 bg-white">
                                            <td
                                                colSpan={6}
                                                className="py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6 lg:pl-8">
                                                No members found
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
