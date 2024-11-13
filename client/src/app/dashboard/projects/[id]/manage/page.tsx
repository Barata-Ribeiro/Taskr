import getProjectByOrgIdAndProjectId from "@/actions/projects/get-project-by-org-id-and-project-id"
import DeleteProject from "@/components/actions/delete-project"
import StateError from "@/components/feedback/state-error"
import EditProjectDetailsForm from "@/components/forms/edit-project-details-form"
import EditProjectStatusForm from "@/components/forms/edit-project-status-form"
import { ProblemDetails } from "@/interfaces/actions"
import { ProjectInfoResponse } from "@/interfaces/project"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

interface ManageProjectPageProps {
    params: {
        id: string
    }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: "Manage Project",
    description:
        "This page, only accessible to project managers, allows them to manage the project. They can modify the project's details or add or remove members.",
}

export default async function ManageProjectPage({ params, searchParams }: Readonly<ManageProjectPageProps>) {
    if (!params.id || !searchParams?.orgId) return notFound()

    const projectState = await getProjectByOrgIdAndProjectId({ orgId: +searchParams?.orgId, projectId: +params.id })
    if (projectState.error) return <StateError error={projectState.error as ProblemDetails} />

    const projectData = projectState.response?.data as ProjectInfoResponse

    const isManager = projectData.project.isManager
    const isOrgOwnerOrAdmin = projectData.organization.isOwner || projectData.organization.isAdmin
    if (!isManager || !isOrgOwnerOrAdmin) {
        return redirect(`/dashboard/projects/${params.id}?orgId=${searchParams?.orgId}`)
    }

    return (
        <div
            id="project-management"
            aria-labelledby="project-management-title"
            className="space-y-10 divide-y divide-gray-900/10">
            <div className="px-6 py-12 sm:py-16 lg:px-8">
                <header className="mx-auto max-w-2xl text-center">
                    <h1
                        id="project-management-title"
                        className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Manage Project
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        This page allows you to manage the project. With necessary credentials, you can update the
                        project status, edit the project details, manage the project team, or delete the project.
                    </p>
                </header>
            </div>

            <section
                id="edit-project-status"
                aria-labelledby="edit-project-status-title"
                className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <header className="px-4 sm:px-0">
                    <h2 id="edit-project-status-title" className="text-base font-semibold leading-7 text-gray-900">
                        Project Status
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Update the project status. This will affect the team&apos;s ability to interact with the
                        project.
                    </p>
                </header>

                <EditProjectStatusForm org={projectData.organization} project={projectData.project} />
            </section>

            <section
                id="edit-project-details"
                aria-labelledby="edit-project-details-title"
                className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <header className="px-4 sm:px-0">
                    <h2 id="edit-project-details-title" className="text-base font-semibold leading-7 text-gray-900">
                        Project Details
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Edit the project details such as its name, description, and deadline.
                    </p>
                </header>

                <EditProjectDetailsForm orgId={projectData.organization.id} project={projectData.project} />
            </section>

            <section
                id="manage-project-members"
                aria-labelledby="manage-project-members-title"
                className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <header className="px-4 sm:px-0">
                    <h2 id="manage-project-members-title" className="text-base font-semibold leading-7 text-gray-900">
                        Project Team
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Add or remove members from the project&apos;s team.
                    </p>
                </header>

                <form className="rounded-lg bg-white shadow-derek ring-1 ring-gray-900/5 md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/*ADD FIELDS*/}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Save
                        </button>
                    </div>
                </form>
            </section>

            <div
                id="project-danger-zone"
                aria-labelledby="project-danger-zone-title"
                className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <header className="px-4 sm:px-0">
                    <h2 id="project-danger-zone-title" className="text-base font-semibold leading-7 text-gray-900">
                        Danger Zone
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Delete the project. This action is irreversible. All data will be lost.
                    </p>
                </header>

                <DeleteProject
                    orgId={projectData.organization.id}
                    projectId={projectData.project.id}
                    isManager={isManager}
                />
            </div>
        </div>
    )
}
