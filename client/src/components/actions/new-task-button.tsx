"use client"

import NewTaskForm from "@/components/forms/new-task-form"
import { Button, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { Fragment, useState } from "react"
import { FaPlus } from "react-icons/fa6"

interface NewTaskButtonProps {
    projectId: string
}

export default function NewTaskButton({ projectId }: NewTaskButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Fragment>
            <Button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex w-max items-center gap-x-2 rounded-md bg-ebony-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ebony-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 active:bg-ebony-800">
                New Task <FaPlus aria-hidden="true" className="h-4 w-4 text-inherit" />
            </Button>

            <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <NewTaskForm projectId={projectId} setIsOpen={setIsOpen} />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}
