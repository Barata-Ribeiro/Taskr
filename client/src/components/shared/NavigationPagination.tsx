"use client"

import { Page } from "@/@types/application"
import { Button } from "@headlessui/react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

interface NavigationPaginationProps {
    pageInfo: Page
}

export default function NavigationPagination({ pageInfo }: Readonly<NavigationPaginationProps>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const page = pageInfo.number ?? parseInt(searchParams.get("page") as string, 10)

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            if (value === "0") params.delete(name)
            return params.toString()
        },
        [searchParams],
    )

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-1 justify-between sm:hidden">
                <Button
                    type="button"
                    onClick={() => router.push(`${pathname}?${createQueryString("page", String(page - 1))}`)}
                    disabled={page < 1}
                    title="Previous Page"
                    className="relative inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 select-none hover:bg-gray-50 disabled:pointer-events-none disabled:grayscale-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    Previous
                </Button>
                <Button
                    type="button"
                    onClick={() => router.push(`${pathname}?${createQueryString("page", String(page + 1))}`)}
                    disabled={page >= pageInfo.totalPages - 1}
                    title="Next Page"
                    className="relative inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 select-none hover:bg-gray-50 disabled:pointer-events-none disabled:grayscale-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    Next
                </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span className="font-medium">{pageInfo.size * page + 1}</span> to{" "}
                    <span className="font-medium">{pageInfo.size}</span> of{" "}
                    <span className="font-medium">{pageInfo.totalElements}</span> results
                </p>
                <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                        <Button
                            type="button"
                            onClick={() => router.push(`${pathname}?${createQueryString("page", String(page - 1))}`)}
                            disabled={page < 1}
                            className="relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 select-none ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:pointer-events-none disabled:grayscale-100 dark:ring-gray-600 dark:hover:bg-gray-600">
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon aria-hidden className="size-5" />
                        </Button>

                        {pageInfo.totalPages > 1 &&
                            [...Array(pageInfo.totalPages)].map((_, index) => {
                                if (
                                    pageInfo.totalPages <= 4 ||
                                    index === 0 ||
                                    index === pageInfo.totalPages - 1 ||
                                    Math.abs(page - index) <= 1
                                ) {
                                    return (
                                        <Button
                                            key={"button-" + (index + 1)}
                                            type="button"
                                            {...(index === page && { "data-current": "" })}
                                            aria-current={index === page ? "page" : undefined}
                                            onClick={() =>
                                                router.push(`${pathname}?${createQueryString("page", String(index))}`)
                                            }
                                            className="cursor-pointer px-4 py-2 text-sm ring-1 ring-gray-300 select-none ring-inset hover:bg-gray-50 focus:outline-offset-0 data-current:z-10 data-current:cursor-default data-current:bg-indigo-600 data-current:text-white data-current:focus-visible:outline-2 data-current:focus-visible:outline-offset-2 data-current:focus-visible:outline-indigo-600 dark:ring-gray-600 dark:hover:bg-gray-600 dark:data-current:bg-indigo-500 dark:data-current:text-white">
                                            {index + 1}
                                        </Button>
                                    )
                                } else if (index === page - 2 || index === page + 2) {
                                    return (
                                        <span
                                            key={"ellipsis-" + (index + 1)}
                                            className="px-4 py-2 text-sm text-gray-700 ring-1 ring-gray-300 select-none ring-inset dark:text-gray-300 dark:ring-gray-600">
                                            ...
                                        </span>
                                    )
                                }
                                return null
                            })}

                        <Button
                            type="button"
                            onClick={() => router.push(`${pathname}?${createQueryString("page", String(page + 1))}`)}
                            disabled={page >= pageInfo.totalPages - 1}
                            className="relative inline-flex cursor-pointer items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 select-none ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:pointer-events-none disabled:grayscale-100 dark:ring-gray-600 dark:hover:bg-gray-600">
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon aria-hidden className="size-5" />
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    )
}
