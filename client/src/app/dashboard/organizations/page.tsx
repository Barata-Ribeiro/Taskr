import getAllOrganizationsPaginated from "@/actions/organizations/get-all-organizations-paginated"
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
    if (!state) return null

    return (
        <section id="organizations-list-section" aria-labelledby="organizations-list-title">
            ORG LIST
        </section>
    )
}
