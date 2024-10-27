"use client"

import { Button, Field, Input, Label } from "@headlessui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaArrowUpShortWide, FaChevronDown, FaMagnifyingGlass } from "react-icons/fa6"

export default function SearchAndSortFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") ?? "")
    const [direction, setDirection] = useState(searchParams.get("direction") ?? "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (search) params.set("search", search)
        else params.delete("search")

        if (direction) params.set("direction", direction)
        else params.delete("direction")

        router.push(`?${params.toString()}`)
    }, [search, direction, searchParams, router])

    function handleSorting() {
        setDirection(direction === "" || direction === "ASC" ? "DESC" : "ASC")
    }

    return (
        <Field className="mt-3 sm:ml-4 sm:mt-0">
            <Label htmlFor="mobile-search-organization" className="sr-only">
                Search
            </Label>
            <Label htmlFor="desktop-search-organization" className="sr-only">
                Search
            </Label>
            <div className="flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaMagnifyingGlass aria-hidden="true" className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        id="mobile-search-organization"
                        name="mobile-search-organization"
                        type="search"
                        placeholder="Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:hidden"
                    />
                    <Input
                        id="desktop-search-organization"
                        name="desktop-search-organization"
                        type="search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search Organizations"
                        className="hidden w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:block"
                    />
                </div>
                <Button
                    type="button"
                    onClick={handleSorting}
                    aria-label="Sort by created date"
                    title="Sort by created date"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <FaArrowUpShortWide aria-hidden="true" className="-ml-0.5 h-4 w-4 text-gray-400" />
                    Sort
                    <FaChevronDown aria-hidden="true" className="-mr-1 h-4 w-4 text-gray-400" />
                </Button>
            </div>
        </Field>
    )
}
