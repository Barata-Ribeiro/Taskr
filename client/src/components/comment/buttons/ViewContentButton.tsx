import SafeMarkdown from "@/components/shared/SafeMarkdown"
import DefaultButton from "@/components/ui/DefaultButton"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { ViewIcon, XIcon } from "lucide-react"
import { Fragment, useState } from "react"

interface ViewContentButtonProps {
    content: string
}

export default function ViewContentButton({ content }: Readonly<ViewContentButtonProps>) {
    const [open, setOpen] = useState(false)

    return (
        <Fragment>
            <DefaultButton
                onClick={() => setOpen(true)}
                aria-label="View content"
                buttonType="ghost"
                width="fit"
                isIconOnly>
                <ViewIcon aria-hidden size={16} />
            </DefaultButton>

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed top-0 z-10 w-screen overflow-y-auto sm:inset-0">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative max-h-[90dvh] transform overflow-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-gray-800">
                            <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                <DefaultButton
                                    onClick={() => setOpen(false)}
                                    aria-label="close ontent dialog"
                                    buttonType="ghost"
                                    width="fit"
                                    isIconOnly>
                                    <XIcon aria-hidden size={24} />
                                </DefaultButton>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <SafeMarkdown markdown={content} container={false} />
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}
