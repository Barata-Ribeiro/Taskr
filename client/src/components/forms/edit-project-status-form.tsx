"use client"

import patchUpdateProjectStatus from "@/actions/projects/patch-update-project-status"
import BadgeProjectStatus from "@/components/badges/badge-project-status"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { SimpleOrganization } from "@/interfaces/organization"
import { Project, ProjectStatus } from "@/interfaces/project"
import { Button, Input, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa6"
import { HiChevronUpDown } from "react-icons/hi2"

interface EditProjectStatusFormProps {
    org: SimpleOrganization
    project: Project
}

export default function EditProjectStatusForm({ org, project }: Readonly<EditProjectStatusFormProps>) {
    const [selected, setSelected] = useState<ProjectStatus>(project.status ?? "AWAITING_APPROVAL")

    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(patchUpdateProjectStatus, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) router.push(`/dashboard/organizations/${org.id}/projects/${project.id}`)
    }, [formState.ok, org.id, project.id, router])

    const isAllowedToChangeStatus = org.isOwner || org.isAdmin

    const statusOptions: ProjectStatus[] = ["AWAITING_APPROVAL", "ACTIVE", "INACTIVE", "COMPLETED"]

    return (
        <form
            action={formAction}
            onSubmit={onSubmit}
            className="rounded-lg bg-white shadow-derek ring-1 ring-gray-900/5 md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
                <Input type="hidden" name="organizationId" value={org.id} />
                <Input type="hidden" name="projectId" value={project.id} />

                <Listbox value={selected} onChange={setSelected} name="status" defaultValue={project.status}>
                    <Label className="block text-sm font-medium leading-6 text-gray-900">Project Status</Label>
                    <div className="relative mt-2">
                        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony-600 sm:text-sm sm:leading-6">
                            <span className="inline-flex items-center gap-x-2 truncate">
                                {selected
                                    .toLowerCase()
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                <BadgeProjectStatus type="icon-only" status={selected} />
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <HiChevronUpDown aria-hidden="true" className="h-5 w-5 text-gray-400" />
                            </span>
                        </ListboxButton>

                        <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm">
                            {statusOptions.map((status, idx) => (
                                <ListboxOption
                                    key={status + "_" + idx}
                                    value={status}
                                    className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-ebony-600 data-[focus]:text-white">
                                    <span className="inline-flex items-center gap-x-2 truncate font-normal group-data-[selected]:font-semibold">
                                        {status
                                            .toLowerCase()
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                        <BadgeProjectStatus type="icon-only" status={status} />
                                    </span>

                                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-ebony-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                        <FaCheck aria-hidden="true" className="h-4 w-4" />
                                    </span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>
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
