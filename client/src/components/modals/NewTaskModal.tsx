"use client"

import NewTaskForm from "@/components/forms/task/NewTaskForm"
import DefaultButton from "@/components/ui/DefaultButton"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { PlusIcon } from "lucide-react"
import { Fragment, useState } from "react"

interface NewTaskModalProps {
    projectId: number
}

export default function NewTaskModal({ projectId }: Readonly<NewTaskModalProps>) {
    const [open, setOpen] = useState(false)

    return (
        <Fragment>
            <DefaultButton width="fit" buttonType="ghost" onClick={() => setOpen(true)}>
                <PlusIcon aria-hidden size={18} />
                New Task
            </DefaultButton>

            <Dialog open={open} onClose={setOpen} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed top-0 z-10 sm:inset-0">
                    <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative max-h-[90dvh] transform overflow-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-gray-800">
                            <header className="relative mb-4 flex h-24 items-center justify-center rounded-md bg-gray-800 text-white dark:bg-gray-700">
                                <DialogTitle as="h4" className="text-2xl">
                                    New Task
                                </DialogTitle>
                            </header>

                            <NewTaskForm projectId={projectId} />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}
