"use client"

import { ProblemDetails } from "@/interfaces/actions"
import { Transition } from "@headlessui/react"
import { useEffect, useState } from "react"
import { FaCircleXmark, FaXmark } from "react-icons/fa6"

interface ApiRequestErrorProps {
    error: ProblemDetails
}

export default function ApiRequestError({ error }: Readonly<ApiRequestErrorProps>) {
    const [show, setShow] = useState(error !== null && !Array.isArray(error))

    useEffect(() => {
        setShow(error !== null && !Array.isArray(error))
    }, [error])

    return (
        <>
            {/* Global notification live region */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6">
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    <Transition show={show}>
                        <div className="pointer-events-auto w-full overflow-hidden rounded-lg bg-red-50 shadow-derek ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaCircleXmark aria-hidden="true" className="h-6 w-6 text-red-400" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <h3 className="text-sm font-medium text-red-800">{error.title}</h3>
                                        <p className="mt-1 text-sm text-red-700">{error.detail}</p>
                                    </div>
                                    <div className="ml-4 flex flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setShow(false)}
                                            className="inline-flex rounded-md bg-red-100 text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                            <span className="sr-only">Close</span>
                                            <FaXmark aria-hidden="true" className="h-5 w-5" />
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
