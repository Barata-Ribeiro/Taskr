"use client"

import patchUpdateProject from "@/actions/projects/patch-update-project"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { SimpleOrganization } from "@/interfaces/organization"
import { Project } from "@/interfaces/project"
import { Button } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface EditProjectStatusFormProps {
    org: SimpleOrganization
    project: Project
}

export default function EditProjectStatusForm({ org, project }: Readonly<EditProjectStatusFormProps>) {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(patchUpdateProject, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) router.push(`/dashboard/organizations/${org.id}/projects/${project.id}`)
    }, [formState.ok, org.id, project.id, router])

    const isAllowedToChangeStatus = org.isOwner || org.isAdmin

    return (
        <form
            action={formAction}
            onSubmit={onSubmit}
            className="rounded-lg bg-white shadow-derek ring-1 ring-gray-900/5 md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">{/*ADD FIELD*/}</div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-800 active:text-gray-700">
                    Go Back
                </button>
                <Button
                    type="submit"
                    disabled={isPending || !isAllowedToChangeStatus}
                    className="inline-flex items-center justify-center rounded-md bg-ebony-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ebony-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 active:bg-ebony-800 disabled:opacity-50">
                    {isPending ? (
                        <>
                            <Spinner /> Loading...
                        </>
                    ) : (
                        "Change Status"
                    )}
                </Button>
            </div>
        </form>
    )
}
