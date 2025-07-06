import { Paginated, QueryParams } from "@/@types/application"
import { Project } from "@/@types/project"
import getAllMyProjectsPaginated from "@/actions/project/get-all-my-projects-paginated"
import NavigationPagination from "@/components/shared/NavigationPagination"
import ProjectStatusBadge from "@/components/shared/project/ProjectStatusBadge"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import dateFormatter from "@/utils/date-formatter"
import { auth } from "auth"
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

interface MyProjectsPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "My Projects",
    description: "List of projects created by me.",
}

type ProjectPageParams = Pick<Project, "id" | "title" | "status" | "owner" | "dueDate" | "createdAt">

export default async function MyProjectsPage({ params, searchParams }: Readonly<MyProjectsPageProps>) {
    const [{ username }, pageParams] = await Promise.all([params, searchParams])
    if (!username) notFound()
    if (!pageParams) return null

    const { page = 0, perPage = 10, direction = "DESC", orderBy = "createdAt" } = pageParams as QueryParams

    const [session, state] = await Promise.all([
        auth(),
        getAllMyProjectsPaginated({ page, perPage, direction, orderBy }),
    ])

    if (!session) redirect("/auth/login")
    if (session.user?.username !== username) redirect(`/dashboard/${session.user?.username}/projects`)

    const pagination = state.response?.data as Paginated<Project>
    const content = pagination.content ?? []

    const baseUrl = `/dashboard/${session.user.username}/projects`

    function buildUrl(item: keyof ProjectPageParams, direction: QueryParams["direction"]): string {
        let orderUrl = `${baseUrl}?orderBy=${item}`

        function getNextDirection(currentOrderBy: string) {
            const isAscDirection = direction === "ASC" ? "DESC" : "ASC"
            return orderBy === currentOrderBy ? isAscDirection : "ASC"
        }

        if (getNextDirection(item) === "ASC") orderUrl += "&direction=ASC"
        if (page) orderUrl += `&page=${page}`
        return orderUrl
    }

    return (
        <section>
            <div className="px-4 sm:px-6 lg:px-8">
                <header className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold">Projects</h1>
                        <p className="mt-2 text-base text-gray-700 dark:text-gray-400">
                            Here you can view all projects you have created or involved in.
                            <br />
                            You are viewing a total of {pagination.page.totalElements} project
                            {pagination.page.totalElements > 1 ? "s" : ""}.
                        </p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-x-2 sm:mt-0 sm:ml-16 sm:flex-none">
                        <DefaultLinkButton href={`/dashboard/${session.user.username}/projects/create`} width="fit">
                            <PlusIcon aria-hidden size={18} />
                            New Project
                        </DefaultLinkButton>

                        <DefaultLinkButton
                            aria-label="Clear url params"
                            title="Clear url params"
                            width="fit"
                            buttonType="ghost"
                            isIconOnly
                            href={baseUrl}>
                            <Trash2Icon aria-hidden="true" className="size-4" />
                        </DefaultLinkButton>
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
                                                <Link
                                                    href={buildUrl("id", direction)}
                                                    className="group inline-flex items-center">
                                                    Id{" "}
                                                    <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                        {direction === "ASC" && orderBy === "id" ? (
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
                                                    href={buildUrl("title", direction)}
                                                    className="group inline-flex items-center">
                                                    Title{" "}
                                                    <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                        {direction === "ASC" && orderBy === "title" ? (
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
                                                    href={buildUrl("status", direction)}
                                                    className="group inline-flex items-center">
                                                    Status{" "}
                                                    <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                        {direction === "ASC" && orderBy === "status" ? (
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
                                                    href={buildUrl("owner", direction)}
                                                    className="group inline-flex items-center">
                                                    Owner{" "}
                                                    <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                        {direction === "ASC" && orderBy === "owner" ? (
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
                                                    href={buildUrl("dueDate", direction)}
                                                    className="group inline-flex items-center">
                                                    Due Date{" "}
                                                    <span className="invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible">
                                                        {direction === "ASC" && orderBy === "dueDate" ? (
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
                                            <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                                                <span className="sr-only">View</span>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900">
                                        {content.map(project => (
                                            <tr key={project.id}>
                                                <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-6">
                                                    {project.id}
                                                </td>
                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    <Link
                                                        href={`${baseUrl}/${project.id}`}
                                                        aria-label={`View project ${project.title}`}
                                                        title={`View project ${project.title}`}
                                                        className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                                                        {project.title}
                                                    </Link>
                                                </td>
                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    <ProjectStatusBadge status={project.status} type="text" />
                                                </td>
                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {project.owner.displayName}
                                                </td>
                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {dateFormatter(project.dueDate)}
                                                </td>
                                                <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {dateFormatter(project.createdAt)}
                                                </td>
                                                <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                                                    <DefaultLinkButton
                                                        aria-label={`View project ${project.title}`}
                                                        title={`View project ${project.title}`}
                                                        width="fit"
                                                        buttonType="ghost"
                                                        isIconOnly
                                                        href={`${baseUrl}/${project.id}`}>
                                                        <EyeIcon aria-hidden="true" className="size-4" />
                                                    </DefaultLinkButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <NavigationPagination pageInfo={pagination.page} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
