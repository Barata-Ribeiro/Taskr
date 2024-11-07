import { Paginated } from "@/interfaces/actions"
import { OrganizationProject } from "@/interfaces/project"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

interface StackedOrganizationProjectsListProps {
    orgId: string
    data: Paginated<OrganizationProject>
}

export default function StackedOrganizationProjectsList({
    orgId,
    data,
}: Readonly<StackedOrganizationProjectsListProps>) {
    if (!data) return <p>No projects found</p>

    const statuses = {
        COMPLETED: "text-green-700 bg-green-50 ring-green-600/20",
        ACTIVE: "text-blue-600 bg-blue-50 ring-blue-500/10",
        INACTIVE: "text-gray-600 bg-gray-50 ring-gray-500/10",
        AWAITING_APPROVAL: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
    }

    return (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-900/5">
            {data.content.map(pivot => {
                const projectKey = pivot.project.name + "_" + pivot.project.id
                const projectUrl = `/dashboard/organizations/${orgId}/projects/${pivot.project.id}`
                return (
                    <li
                        key={projectKey}
                        className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
                        aria-labelledby={`project-${projectKey}-title`}>
                        <div className="min-w-0">
                            <div className="flex items-start gap-x-3">
                                <h3
                                    id={`project-${projectKey}-title`}
                                    className="text-sm font-semibold leading-6 text-gray-900">
                                    <Link href={projectUrl}>
                                        <span className="absolute inset-x-0 -top-px bottom-0" />
                                        {pivot.project.name}
                                    </Link>
                                </h3>
                                <p
                                    className={twMerge(
                                        statuses[pivot.status],
                                        "mt-0.5 select-none whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
                                    )}
                                    aria-label={pivot.status}>
                                    {pivot.status.replace(/_/g, " ").toLowerCase()}
                                </p>
                            </div>
                            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                <p className="whitespace-nowrap">
                                    Due on{" "}
                                    <time dateTime={pivot.project.deadline}>{parseDate(pivot.project.deadline)}</time>
                                </p>
                                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                    <circle r={1} cx={1} cy={1} />
                                </svg>
                                <p className="truncate">
                                    {pivot.project.membersCount} member(s), {pivot.project.tasksCount} task(s)
                                </p>
                            </div>
                        </div>

                        <FaChevronRight aria-hidden="true" className="h-3 w-3 flex-none text-gray-400" />
                    </li>
                )
            })}
        </ul>
    )
}
