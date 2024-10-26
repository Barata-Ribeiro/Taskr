import getOrganizationById from "@/actions/organizations/get-organization-by-id"
import StateError from "@/components/feedback/state-error"
import { ProblemDetails } from "@/interfaces/actions"
import { Organization } from "@/interfaces/organization"
import { notFound } from "next/navigation"

interface OrganizationPageProps {
    params: {
        id: string
    }
}

export default async function OrganizationPage({ params }: Readonly<OrganizationPageProps>) {
    if (!params.id) return notFound()

    const state = await getOrganizationById({ id: params.id })
    if (!state.ok) return <StateError error={state.error as ProblemDetails} />

    const data = state.response?.data as Organization

    return (
        <section id="organizations-org-info-section" aria-labelledby="organizations-org-info-title">
            <h2 id="organizations-org-info-title">{data.name}</h2>
            <p>{data.description}</p>

            <p>{JSON.stringify(data)}</p>
        </section>
    )
}
