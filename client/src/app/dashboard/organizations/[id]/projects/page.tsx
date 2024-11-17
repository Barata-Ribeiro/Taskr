import getOrganizationProjectsById from "@/actions/organizations/get-organization-projects-by-id"
import StateError from "@/components/feedback/state-error"
import TableCompleteFilter from "@/components/filters/table-complete-filter"
import { ProblemDetails } from "@/interfaces/actions"
import { OrganizationProjectsList } from "@/interfaces/organization"
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
        <div
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
        </div>
    )
}
