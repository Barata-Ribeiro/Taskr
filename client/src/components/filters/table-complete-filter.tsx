"use client"

import { Button, Field, Input, Label, Select } from "@headlessui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaMagnifyingGlass, FaTrash } from "react-icons/fa6"

interface TableCompleteFilterProps {
    allowSearch?: boolean
    filterType: "members" | "projects" | "notifications"
}

export default function TableCompleteFilter({ allowSearch = true, filterType }: Readonly<TableCompleteFilterProps>) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") ?? "")
    const [direction, setDirection] = useState(searchParams.get("direction") ?? "")
    const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") ?? "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (search) params.set("search", search)
        else params.delete("search")

        if (direction) params.set("direction", direction)
        else params.delete("direction")

        if (orderBy) params.set("orderBy", orderBy)
        else params.delete("orderBy")

        router.push(`?${params.toString()}`)
    }, [search, direction, orderBy, searchParams, router])

    function clearFilters() {
        setSearch("")
        setDirection("")
        setOrderBy("")
    }

    const isOrganizationMembersFilter =
        (pathname.includes("/organizations/") && pathname.includes("/members")) || filterType === "members"
    const isOrganizationProjectsFilter =
        (pathname.includes("/organizations/") && pathname.includes("/projects")) || filterType === "projects"
    const isNotificationsFilter = pathname.includes("/notifications") || filterType === "notifications"

    const filterTypeToTitle =
        filterType === "members" ? "Members" : filterType === "projects" ? "Projects" : "Notifications"

    return (
        <section aria-labelledby="filter-heading" className="py-6">
            <h2 id="filter-heading" className="sr-only">
                {filterTypeToTitle} Filter
            </h2>

            <div className="flex flex-wrap items-center justify-evenly gap-4 md:flex-nowrap">
                {allowSearch && (
                    <Field className="grid w-full md:max-w-sm">
                        <Label className="block text-left text-sm font-medium leading-6 text-gray-900">Search</Label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaMagnifyingGlass aria-hidden="true" className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="search"
                                name="search"
                                value={search}
                                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                            />
                        </div>
                    </Field>
                )}

                <Field className="grid w-full md:max-w-sm">
                    <Label className="block text-left text-sm font-medium leading-6 text-gray-900">Direction</Label>
                    <Select
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        name="direction"
                        value={direction}
                        onChange={e => setDirection(e.target.value)}>
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                    </Select>
                </Field>

                <Field className="grid w-full md:max-w-sm">
                    <Label className="block text-left text-sm font-medium leading-6 text-gray-900">Order By</Label>
                    <Select
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-ebony-600 sm:text-sm sm:leading-6"
                        name="orderBy"
                        value={orderBy}
                        onChange={e => setOrderBy(e.target.value)}>
                        {isOrganizationMembersFilter && (
                            <>
                                <option value="username">Username</option>
                                <option value="displayName">Display Name</option>
                                <option value="fullName">Name</option>
                                <option value="email">Email</option>
                            </>
                        )}
                        {isOrganizationProjectsFilter && (
                            <>
                                <option value="name">Name</option>
                                <option value="description">Description</option>
                                <option value="deadline">Deadline</option>
                                <option value="status">Status</option>
                            </>
                        )}
                        {isNotificationsFilter && (
                            <>
                                <option value="title">Title</option>
                                <option value="isRead">Is Read</option>
                                <option value="readAt">Read At</option>
                                <option value="issuedAt">Issued At</option>
                            </>
                        )}
                        {!isNotificationsFilter && (
                            <>
                                <option value="createdAt">Created At</option>
                                <option value="updatedAt">Updated At</option>
                            </>
                        )}
                    </Select>
                </Field>

                <Button
                    type="button"
                    onClick={clearFilters}
                    title="Clear Filters"
                    className="inline-flex w-full items-center justify-center gap-2 self-end rounded-md bg-ebony-600 p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ebony-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600 active:bg-ebony-800 md:h-max md:w-max">
                    <span className="sr-only">Clear Filters</span>
                    <p className="inline-block md:hidden">Clear Filters</p>{" "}
                    <FaTrash aria-hidden className="h-4 w-4 text-white md:h-5 md:w-5" />
                </Button>
            </div>
        </section>
    )
}
