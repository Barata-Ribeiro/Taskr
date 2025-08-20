import { Paginated, QueryParams } from "@/@types/application"
import { User } from "@/@types/user"
import adminGetAllUsersPaginated from "@/actions/admin/admin-get-all-users-paginated"
import AdminToggleBanButton from "@/components/admin/buttons/AdminToggleBanButton"
import AdminToggleVerificationButton from "@/components/admin/buttons/AdminToggleVerificationButton"
import NavigationPagination from "@/components/shared/NavigationPagination"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import Badge from "@/components/user/Badge"
import VerifiedBadge from "@/components/user/VerifiedBadge"
import dateFormatter from "@/utils/date-formatter"
import { auth } from "auth"
import { ChevronDownIcon, ChevronUpIcon, EyeIcon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Users Management",
    description: "Locate and manage users within your application.",
}

interface UsersPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

type UserPageParams = Pick<User, "username" | "email" | "role" | "createdAt" | "updatedAt">

export default async function UsersPage({ params, searchParams }: Readonly<UsersPageProps>) {
    const [{ username }, pageParams] = await Promise.all([params, searchParams])
    if (!username) notFound()
    if (!pageParams) return null

    const { page = 0, perPage = 10, direction = "DESC", orderBy = "createdAt" } = pageParams as QueryParams

    const [session, state] = await Promise.all([
        auth(),
        adminGetAllUsersPaginated({ page, perPage, direction, orderBy }),
    ])

    if (!session) redirect("/auth/login")
    if (session.user?.username !== username) redirect(`/dashboard/${session.user?.username}/admin/users`)

    const pagination = state.response?.data as Paginated<User>
    const content = pagination.content ?? []

    const baseUrl = `/dashboard/${session.user.username}`
    const baseAdminUrl = `${baseUrl}/admin/users`

    function buildUrl(item: keyof UserPageParams, direction: QueryParams["direction"]): string {
        let orderUrl = `${baseAdminUrl}?orderBy=${item}`

        function getNextDirection(currentOrderBy: string) {
            const isAscDirection = direction === "ASC" ? "DESC" : "ASC"
            return orderBy === currentOrderBy ? isAscDirection : "ASC"
        }

        if (getNextDirection(item) === "ASC") orderUrl += "&direction=ASC"
        if (page) orderUrl += `&page=${page}`
        return orderUrl
    }

    return (
        <section className="px-4 sm:px-6 lg:px-8">
            {/*TODO: Add return to admin panel button*/}
            <header>
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold">Users</h1>
                    <p className="mt-2 text-base text-gray-700 dark:text-gray-400">
                        A list of all the users in your account including their username, email, and creation date. From
                        a total of {pagination.page.totalElements} user(s).
                    </p>
                </div>
            </header>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold sm:pl-6">
                                            Id
                                        </th>

                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            <Link
                                                href={buildUrl("username", direction)}
                                                className="group inline-flex items-center">
                                                Username{" "}
                                                <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                    {direction === "ASC" && orderBy === "username" ? (
                                                        <ChevronUpIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    ) : (
                                                        <ChevronDownIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    )}
                                                </span>
                                            </Link>
                                        </th>

                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            <Link
                                                href={buildUrl("email", direction)}
                                                className="group inline-flex items-center">
                                                Email{" "}
                                                <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                    {direction === "ASC" && orderBy === "email" ? (
                                                        <ChevronUpIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    ) : (
                                                        <ChevronDownIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    )}
                                                </span>
                                            </Link>
                                        </th>

                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            <Link
                                                href={buildUrl("role", direction)}
                                                className="group inline-flex items-center">
                                                Role{" "}
                                                <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                    {direction === "ASC" && orderBy === "role" ? (
                                                        <ChevronUpIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    ) : (
                                                        <ChevronDownIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    )}
                                                </span>
                                            </Link>
                                        </th>

                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            <Link
                                                href={buildUrl("createdAt", direction)}
                                                className="group inline-flex items-center">
                                                Created At{" "}
                                                <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                    {direction === "ASC" && orderBy === "createdAt" ? (
                                                        <ChevronUpIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    ) : (
                                                        <ChevronDownIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    )}
                                                </span>
                                            </Link>
                                        </th>

                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                            <Link
                                                href={buildUrl("updatedAt", direction)}
                                                className="group inline-flex items-center">
                                                Last Modified{" "}
                                                <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                    {direction === "ASC" && orderBy === "updatedAt" ? (
                                                        <ChevronUpIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    ) : (
                                                        <ChevronDownIcon
                                                            aria-hidden
                                                            className="h-5 w-full text-inherit"
                                                        />
                                                    )}
                                                </span>
                                            </Link>
                                        </th>

                                        <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                                            <span className="sr-only">Manage</span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900">
                                    {content.map(user => {
                                        const profileUrl = `${baseUrl}/profile/${user.username}`
                                        const profileLabel = `View ${user.username} profile`
                                        const mailtoLabel = `Send email to ${user.email}`

                                        return (
                                            <tr key={user.id}>
                                                <td
                                                    className="max-w-[10ch] min-w-[5ch] truncate py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-6"
                                                    aria-label={user.id}
                                                    title={user.id}>
                                                    {user.id}
                                                </td>

                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    <Link
                                                        href={profileUrl}
                                                        aria-label={profileLabel}
                                                        title={profileLabel}
                                                        className="inline-flex items-center gap-x-2 text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                                                        <p>@{user.username}</p>
                                                        {user.isVerified && <VerifiedBadge />}
                                                    </Link>
                                                </td>

                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    <Link
                                                        href={`mailto:${user.email}`}
                                                        aria-label={mailtoLabel}
                                                        title={mailtoLabel}
                                                        className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                                                        {user.email}
                                                    </Link>
                                                </td>

                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    <Badge userRole={user.role} />
                                                </td>

                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {dateFormatter(user.createdAt)}
                                                </td>

                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {dateFormatter(user.updatedAt)}
                                                </td>

                                                <td className="inline-flex items-center gap-x-2 py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                                                    <DefaultLinkButton
                                                        aria-label={profileLabel}
                                                        title={profileLabel}
                                                        width="fit"
                                                        buttonType="ghost"
                                                        isIconOnly
                                                        href={profileUrl}>
                                                        <EyeIcon aria-hidden className="size-4" />
                                                    </DefaultLinkButton>

                                                    <AdminToggleVerificationButton
                                                        username={user.username}
                                                        session={session}
                                                    />

                                                    <AdminToggleBanButton username={user.username} session={session} />

                                                    {/*TODO: Add edit/delete button action*/}
                                                </td>
                                            </tr>
                                        )
                                    })}

                                    {content.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <NavigationPagination pageInfo={pagination.page} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
