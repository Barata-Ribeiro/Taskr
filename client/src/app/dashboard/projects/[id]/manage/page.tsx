import getProjectByOrgIdAndProjectId from "@/actions/projects/get-project-by-org-id-and-project-id"
import StateError from "@/components/feedback/state-error"
import EditProjectDetailsForm from "@/components/forms/edit-project-details-form"
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
    if (!isManager) return redirect(`/dashboard/projects/${params.id}?orgId=${searchParams?.orgId}`)

    return (
        <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Project</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Edit the project details such as its name, description, and deadline.
                    </p>
                </div>

                <EditProjectDetailsForm orgId={projectData.organization.id} project={projectData.project} />
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Project Deadline</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Change the project deadline. This will affect the project&apos;s timeline.
                    </p>
                </div>

                <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">{/*ADD FIELD*/}</div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Update
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Project Team</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Add or remove members from the project&apos;s team.
                    </p>
                </div>

                <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
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
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Danger Zone</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Delete the project. This action is irreversible. All data will be lost.
                    </p>
                </div>

                <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    {/*ADD PROJECT DELETION*/}
                </form>
            </div>
        </div>
    )
}
