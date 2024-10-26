import getAllOrganizationsPaginated from "@/actions/organizations/get-all-organizations-paginated"
import NewOrganizationCTA from "@/components/actions/new-organization-c-t-a"
import StateError from "@/components/feedback/state-error"
import { Paginated, ProblemDetails } from "@/interfaces/actions"
import { Organization } from "@/interfaces/organization"
import { Metadata } from "next"

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

    console.group("OrganizationsPage")
    console.log("CONTENT: ", content)
    console.log("PAGE INFO: ", pageInfo)
    console.groupEnd()

    return (
        <section id="organizations-list-section" aria-labelledby="organizations-list-title">
            <NewOrganizationCTA />
        </section>
    )
}
