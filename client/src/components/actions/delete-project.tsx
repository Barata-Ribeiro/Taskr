"use client"

import deleteProjectByOrgIdAndProjetId from "@/actions/projects/delete-project-by-org-id-and-projet-id"
import ApiRequestFormProps from "@/components/feedback/api-request-form-error"
import Spinner from "@/components/helpers/spinner"
import { ProblemDetails } from "@/interfaces/actions"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaExclamationTriangle } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"

interface DeleteProjectProps {
    orgId: number
    projectId: string
    isManager: boolean
}

export default function DeleteProject({ orgId, projectId, isManager }: Readonly<DeleteProjectProps>) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<ProblemDetails | null>(null)

    const router = useRouter()

    async function handleDeleteProject() {
        setIsPending(true)
        setError(null)

        const state = await deleteProjectByOrgIdAndProjetId({ orgId, projectId })

        if (state.error) {
            setError(state.error as ProblemDetails)
            setIsPending(false)
            return
        }

        setIsPending(false)
        setIsOpen(false)
        router.replace(`/dashboard/organizations/${orgId}`)
    }

    return (
        <article className="rounded-lg bg-white shadow-derek ring-1 ring-gray-900/5 md:col-span-2">
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-8 px-4 py-6 sm:p-8 md:grid-cols-3">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Delete Project</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                        Delete this project. This action is <strong>not reversible</strong>. All information related to
                        this project will be <strong>deleted permanently</strong>.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    disabled={!isManager}
                    className="inline-flex items-center justify-center place-self-start rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:bg-red-800 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 md:col-span-2 md:mt-0">
                    Delete Project
                </Button>
            </div>

            <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="sr-only">Close</span>
                                    <FaXmark aria-hidden="true" className="h-6 w-6" />
                                </Button>
                            </div>
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaExclamationTriangle aria-hidden="true" className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        Delete Project
                                    </DialogTitle>
                                    <div className="my-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this project? This action is{" "}
                                            <strong>irreversible</strong>. All information related to this project will
                                            be <strong>deleted permanently</strong>.
                                        </p>
                                    </div>

                                    {error && !Array.isArray(error) && <ApiRequestFormProps error={error} />}
                                </div>
                            </div>
                            <div className="mt-3 sm:mt-2 sm:flex sm:flex-row-reverse">
                                <Button
                                    type="button"
                                    disabled={isPending || !isManager}
                                    onClick={handleDeleteProject}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:ml-3 sm:w-auto">
                                    {isPending ? (
                                        <>
                                            <Spinner /> Loading...
                                        </>
                                    ) : (
                                        "Yes, delete this project"
                                    )}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </article>
    )
}
