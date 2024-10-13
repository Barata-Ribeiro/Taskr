"use client"

import { Transition } from "@headlessui/react"
import { useEffect, useState } from "react"
import { FaCircleCheck, FaX } from "react-icons/fa6"

interface SuccessToastrProps {
    content: {
        success: boolean
        message: string
        username: string
    }
}

export default function RegistrationSuccessToastr({ content }: Readonly<SuccessToastrProps>) {
    const [show, setShow] = useState(content.success)

    useEffect(() => {
        setShow(content.success)
    }, [content.success])

    function close() {
        setShow(false)

        const url = new URL(window.location.href)
        url.searchParams.delete("success")
        url.searchParams.delete("message")
        url.searchParams.delete("username")
        window.history.replaceState({}, "", url.toString())
    }

    return (
        <>
            {/* Global notification live region */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    <Transition show={show}>
                        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaCircleCheck aria-hidden="true" className="h-6 w-6 text-green-400" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            Welcome, <span className="font-semibold">{content.username}</span>!
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{content.message}</p>
                                    </div>
                                    <div className="ml-4 flex flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={close}
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <span className="sr-only">Close</span>
                                            <FaX aria-hidden="true" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>
    )
}
